import pytest
from dash_text_annotate import convert_offsets, validate_entities


def test_unicode_offsets_and_legacy_migration():
    text = '😀 Acme\n你好 e\u0301'
    legacy = [{'start': 3, 'end': 7, 'tag': 'ORG', 'note': {'reviewed': False}}]
    values = convert_offsets(text, legacy)
    assert text[values[0]['start']:values[0]['end']] == values[0]['text'] == 'Acme'
    assert (values[0]['start'], values[0]['end']) == (2, 6)
    assert convert_offsets(text, values, 'codepoint', 'utf16')[0]['start'] == 3
    values[0]['note']['reviewed'] = True
    assert legacy[0]['note']['reviewed'] is False


@pytest.mark.parametrize('start,end', [(None, 2), (True, 2), (-1, 2), (0, 7), (2, 2), (3, 2), (0.5, 2)])
def test_invalid_ranges(start, end):
    with pytest.raises(ValueError, match='offsets'):
        validate_entities('abcdef', [{'start': start, 'end': end, 'tag': 'A'}])


def test_validation_and_identity():
    assert validate_entities('abc') == []
    with pytest.raises(ValueError, match='Unicode'):
        validate_entities('😀', [{'start': 0, 'end': 1, 'tag': 'A'}], 'utf16')
    with pytest.raises(ValueError, match='source'):
        validate_entities('abc', [{'start': 0, 'end': 2, 'text': 'bc', 'tag': 'A'}])
    with pytest.raises(ValueError, match='unique'):
        validate_entities('abc', [{'id': 'x', 'start': 0, 'end': 2, 'tag': 'A'}] * 2)
    values = validate_entities('abcdef', [{'start': 1, 'end': 4, 'tag': 'A'}, {'start': 2, 'end': 5, 'tag': 'B'}])
    assert [e['text'] for e in values] == ['bcd', 'cde']
    assert values == validate_entities('abcdef', values)
