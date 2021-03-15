# AUTO GENERATED FILE - DO NOT EDIT

export 'dta'_dashtextannotate

"""
    'dta'_dashtextannotate(;kwargs...)

A DashTextAnnotate component.
Learnings:
Don't try to print (<p>..) lists or dictionaries directly
Keyword arguments:
- `id` (String; optional): The ID used to identify this component in Dash callbacks.
- `text` (String; required): The text that should be annotated
- `entities` (Array; optional): The entities that are currently available
- `tag` (String; required): The currently selected tag (e.g. DATE) with which the selections will be tagged. This must be managed by the Dash App.
- `tag_color` (String; optional): The currently selected tag color (e.g. GREEN) with which the selected tag will be colored. This must be managed by the Dash App.
"""
function 'dta'_dashtextannotate(; kwargs...)
        available_props = Symbol[:id, :text, :entities, :tag, :tag_color]
        wild_props = Symbol[]
        return Component("'dta'_dashtextannotate", "DashTextAnnotate", "dash_text_annotate", available_props, wild_props; kwargs...)
end

