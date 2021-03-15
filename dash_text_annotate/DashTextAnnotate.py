# AUTO GENERATED FILE - DO NOT EDIT

from dash.development.base_component import Component, _explicitize_args


class DashTextAnnotate(Component):
    """A DashTextAnnotate component.
Learnings:
Don't try to print (<p>..) lists or dictionaries directly

Keyword arguments:
- id (string; optional): The ID used to identify this component in Dash callbacks.
- text (string; required): The text that should be annotated
- entities (list; optional): The entities that are currently available
- tag (string; required): The currently selected tag (e.g. DATE) with which the selections will be tagged. This must be managed by the Dash App.
- tag_color (string; optional): The currently selected tag color (e.g. GREEN) with which the selected tag will be colored. This must be managed by the Dash App."""
    @_explicitize_args
    def __init__(self, id=Component.UNDEFINED, text=Component.REQUIRED, entities=Component.UNDEFINED, tag=Component.REQUIRED, tag_color=Component.UNDEFINED, **kwargs):
        self._prop_names = ['id', 'text', 'entities', 'tag', 'tag_color']
        self._type = 'DashTextAnnotate'
        self._namespace = 'dash_text_annotate'
        self._valid_wildcard_attributes =            []
        self.available_properties = ['id', 'text', 'entities', 'tag', 'tag_color']
        self.available_wildcard_properties =            []

        _explicit_args = kwargs.pop('_explicit_args')
        _locals = locals()
        _locals.update(kwargs)  # For wildcard attrs
        args = {k: _locals[k] for k in _explicit_args if k != 'children'}

        for k in ['text', 'tag']:
            if k not in args:
                raise TypeError(
                    'Required argument `' + k + '` was not specified.')
        super(DashTextAnnotate, self).__init__(**args)
