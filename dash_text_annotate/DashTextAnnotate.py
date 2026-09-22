# AUTO GENERATED FILE - DO NOT EDIT

import typing  # noqa: F401
from typing_extensions import TypedDict, NotRequired, Literal # noqa: F401
from dash.development.base_component import Component, _explicitize_args
try:
    from dash.types import NumberType  # noqa: F401
except ImportError:
    # Backwards compatibility for dash<=4.1.0
    if typing.TYPE_CHECKING:
        raise
    NumberType = typing.Union[  # noqa: F401
        typing.SupportsFloat, typing.SupportsInt, typing.SupportsComplex
    ]

ComponentSingleType = typing.Union[str, int, float, Component, None]
ComponentType = typing.Union[
    ComponentSingleType,
    typing.Sequence[ComponentSingleType],
]


class DashTextAnnotate(Component):
    """A DashTextAnnotate component.
Annotate immutable text with labelled, potentially overlapping spans.
Select text to add the active label, or use the accessible passage search.
Public offsets are zero-based Python code points, end exclusive.

Keyword arguments:

- id (string | dict; optional):
    ID used in Dash callbacks. Pattern-matching dictionary IDs are
    supported.

- aria_label (string; optional):
    Accessible name for the component region. Defaults to Text
    annotation.

- className (string; optional):
    Extra CSS class on the component root.

- document_id (string; optional):
    Document identity. Change together with text and entities when
    loading another record.

- entities (list of dicts; optional):
    List of {start, end, tag, id?, text?, color?}. End is exclusive.
    Extra JSON fields are preserved.

- error (string; optional):
    Output: validation error for incoming data, or None. Invalid
    annotations are not rendered.

- offset_unit (a value equal to: 'codepoint', 'utf16'; optional):
    Offset convention: codepoint (Python slicing, default), or utf16
    for legacy JavaScript data.

- read_only (boolean; optional):
    Disable all edits while retaining highlights and annotation
    review. Defaults to False.

- selected_id (string; optional):
    Output: selected annotation ID, or None.

- show_annotations (boolean; optional):
    Show the selectable annotation list. Defaults to True.

- show_labels (boolean; optional):
    Show selectable category badges above annotated passages. Defaults
    to True. Can change in callbacks without resetting edits.

- show_toolbar (boolean; optional):
    Show editing controls and accessible passage search. Defaults to
    True.

- tag (string; optional):
    Active label applied to new selections. Defaults to LABEL.

- tag_colors (dict; optional):
    Optional mapping of label names to CSS colors. Per-entity color
    takes precedence.

- text (string; required):
    Immutable plain text. Whitespace and newlines are preserved."""
    _children_props: typing.List[str] = []
    _base_nodes = ['children']
    _namespace = 'dash_text_annotate'
    _type = 'DashTextAnnotate'


    def __init__(
        self,
        id: typing.Optional[typing.Union[str, dict]] = None,
        text: typing.Optional[str] = None,
        entities: typing.Optional[typing.Sequence[dict]] = None,
        tag: typing.Optional[str] = None,
        tag_colors: typing.Optional[dict] = None,
        document_id: typing.Optional[str] = None,
        offset_unit: typing.Optional[Literal["codepoint", "utf16"]] = None,
        read_only: typing.Optional[bool] = None,
        show_toolbar: typing.Optional[bool] = None,
        show_annotations: typing.Optional[bool] = None,
        show_labels: typing.Optional[bool] = None,
        className: typing.Optional[str] = None,
        style: typing.Optional[typing.Any] = None,
        aria_label: typing.Optional[str] = None,
        selected_id: typing.Optional[str] = None,
        error: typing.Optional[str] = None,
        **kwargs
    ):
        self._prop_names = ['id', 'aria_label', 'className', 'document_id', 'entities', 'error', 'offset_unit', 'read_only', 'selected_id', 'show_annotations', 'show_labels', 'show_toolbar', 'style', 'tag', 'tag_colors', 'text']
        self._valid_wildcard_attributes =            []
        self.available_properties = ['id', 'aria_label', 'className', 'document_id', 'entities', 'error', 'offset_unit', 'read_only', 'selected_id', 'show_annotations', 'show_labels', 'show_toolbar', 'style', 'tag', 'tag_colors', 'text']
        self.available_wildcard_properties =            []
        _explicit_args = kwargs.pop('_explicit_args')
        _locals = locals()
        _locals.update(kwargs)  # For wildcard attrs and excess named props
        args = {k: _locals[k] for k in _explicit_args}

        for k in ['text']:
            if k not in args:
                raise TypeError(
                    'Required argument `' + k + '` was not specified.')

        super(DashTextAnnotate, self).__init__(**args)

setattr(DashTextAnnotate, "__init__", _explicitize_args(DashTextAnnotate.__init__))
