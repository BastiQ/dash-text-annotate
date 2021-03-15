import dash_text_annotate
import dash
from dash.dependencies import Input, Output
import dash_html_components as html
import dash_core_components as dcc

app = dash.Dash(__name__)

text = 'This is some example text from Sebastian, added 15.03.2021 from his home PC...'
entities = [{
      "start": 48,
      "end": 58,
      "tag": "DATE"
    }]
possible_tags = ['DATE', 'HEADER']
tag = 'DATE' # Make sure this is in possible_tags
tag_color = 'GREEN'

app.layout = html.Div([
    dcc.Dropdown(
        id='entitiy-dropdown',
        options=[{'label': tag_name, 'value': tag_name} for tag_name in possible_tags],
        value=tag
    ),
    dash_text_annotate.DashTextAnnotate( # Put this component into a card (dash bootstrap component)
        id='annotator',
        text=text,
        entities=entities,
        tag=tag,
        tag_color=tag_color,
    ),
    html.H2('Dash Output:'),
    html.Div(id='output')
])


@app.callback(Output('output', 'children'), [Input('annotator', 'entities')]) # Output: div (see above), Input: selected entities
def display_output(value):
    return 'You have selected: {}'.format(value)

@app.callback(Output('annotator', 'tag'), [Input('entitiy-dropdown', 'value')])
def change_tag(value):
    return value

if __name__ == '__main__':
    app.run_server(debug=True)
