"""Validation and offset conversion for plain-text annotation records."""
from copy import deepcopy
from typing import Any, Literal

OffsetUnit = Literal["codepoint", "utf16"]


def _boundaries(text: str) -> list[int]:
    positions = [0]
    for char in text:
        positions.append(positions[-1] + (2 if ord(char) > 0xFFFF else 1))
    return positions


def validate_entities(
    text: str,
    entities: list[dict[str, Any]] | None = None,
    offset_unit: OffsetUnit = "codepoint",
) -> list[dict[str, Any]]:
    """Return an independent, normalized copy or raise ValueError.

    Offsets are zero-based with an exclusive end. Missing IDs are deterministic
    for legacy input; persist the returned IDs to retain identity across edits.
    Supplied quotes must match the immutable document. Extra fields are retained.
    Overlapping spans are valid; IDs must be unique.
    """
    if not isinstance(text, str):
        raise ValueError("text must be a string.")
    if offset_unit not in ("codepoint", "utf16"):
        raise ValueError("Unknown offset_unit.")
    if entities is None:
        entities = []
    if not isinstance(entities, list):
        raise ValueError("entities must be a list.")
    boundaries = _boundaries(text)
    reverse = {offset: index for index, offset in enumerate(boundaries)}
    length = len(text) if offset_unit == "codepoint" else boundaries[-1]
    result, ids = [], set()
    for index, entity in enumerate(entities):
        prefix = f"Annotation {index + 1}: "
        if not isinstance(entity, dict):
            raise ValueError(prefix + "expected an object.")
        start, end, tag = (entity.get(key) for key in ("start", "end", "tag"))
        if type(start) is not int or type(end) is not int or not 0 <= start < end <= length:
            raise ValueError(prefix + f"offsets must satisfy 0 ≤ start < end ≤ {length}.")
        if offset_unit == "utf16" and (start not in reverse or end not in reverse):
            raise ValueError(prefix + "offsets cannot split a Unicode character.")
        if not isinstance(tag, str) or not tag.strip():
            raise ValueError(prefix + "tag must be a non-empty string.")
        if entity.get("color") is not None and not isinstance(entity["color"], str):
            raise ValueError(prefix + "color must be a string.")
        quote = text[start:end] if offset_unit == "codepoint" else text[reverse[start]:reverse[end]]
        if entity.get("text") is not None and entity["text"] != quote:
            raise ValueError(prefix + "text does not match the source document.")
        entity_id = entity.get("id")
        if entity_id is None:
            entity_id = f"legacy-{index}-{start}-{end}"
        if not isinstance(entity_id, str) or not entity_id or entity_id in ids:
            raise ValueError(prefix + "id must be a unique non-empty string.")
        ids.add(entity_id)
        result.append({**deepcopy(entity), "id": entity_id, "text": quote})
    return result


def convert_offsets(
    text: str,
    entities: list[dict[str, Any]],
    from_unit: OffsetUnit = "utf16",
    to_unit: OffsetUnit = "codepoint",
) -> list[dict[str, Any]]:
    """Validate and convert saved offsets without changing annotation IDs or text."""
    if to_unit not in ("codepoint", "utf16"):
        raise ValueError("Unknown to_unit.")
    values = validate_entities(text, entities, from_unit)
    if from_unit == to_unit:
        return values
    boundaries = _boundaries(text)
    mapping = dict(enumerate(boundaries)) if from_unit == "codepoint" else {
        offset: index for index, offset in enumerate(boundaries)
    }
    return [{**entity, "start": mapping[entity["start"]], "end": mapping[entity["end"]]} for entity in values]
