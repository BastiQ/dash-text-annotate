import dash_text_annotate
import dash
from dash.dependencies import Input, Output
import dash_html_components as html
import dash_core_components as dcc

app = dash.Dash(__name__)

text = '"—_\n\n. Alle im Zusammenhang mit dem Bau und Betrieb der vom Mieter eingebrachten\nGegenstände (insbesondere technischen Geräte) erforderlichen Genehmigungen\nsind Sache des Mieters, Der Vermieter haftet jedoch dafür, wenn erforderliche\nGenehmigungen aus Gründen versagt werden, die auf der Beschaffenheit oder Lage\nder Mietsache beruhen.\n\n.. Der Vermieter stimmt der Durchführung der erforderlichen Umbau-, ... folgende\noder damit zusammenhängende Installationen auf eigene Kosten vorzunehmen:\n® Verlegung von Stromkabeln und Koaxial- bzw. ...,\n® Fachgerechte Verlegung des .. bzw. Koaxial- und Glasfaserkabels\nvom Technikcontainer zur Frauengasse,\n® Installation von Innentechnik im Technikraum,\n® installation einer eigenen Stromversorgung,\n® installation einer eigenen ... zur Versorgung des\nBetriebsraumes,\n® installation einer eigenen Klimaanlage.\n\n. Der Mieter ist von jeglicher Verpflichtung zur Wegereinigung und Streupflicht befreit,\nDie Kosten hierfür sind in den Nebenkosten gemäß $ 5 enthalten.\n\n. Der Vermieter trägt die allgemeine ..für den Zugang zur\nMietsache. Der Vermieter ist nicht berechtigt, innerhalb ..\nan technischen Einrichtungen 0.ä. vorzunehmen, sofern diese nicht von ihm selbst\neingebracht worden sind. § 8 bleibt unberührt.\n\n. Der Vermieter verpfiichtet sich, dem Personal des Mieters sowie in dessen Auftrag\ntätigen Dritten jederzeit freien und ungehinderten Zugang zur Mietfläche zu\nermöglichen. Alle hierfür erforderlichen Schlüssel/Zutrittskarten werden dem Mieter\nmindestens zweifach mit Beginn des Mietvertrages, spätestens jedoch mit Beginn\ndes technischen Betriebs durch den Mieter vom Vermieter ausgehändigt. Dem Mieter\nwird gestattet, eine eigene Schließanlage (für den Technikcontainer) zu montieren.\nDer Vermieter erhält einen Havarieschlüssel für den Technikcontainer. en\n\n- Die Ausgestaltung des .. steht im Belieben des Mieters, ein\nAbidseanspruch des Mieters bei Mietende für etwaige Einbauten besteht nicht. Der\nMieter hat das Recht und auf Verlangen des Vermieters die Pflicht, bei Mietende den\nursprünglichen Zustand wieder herzustellen (Rückbau der Elektrounterverteilung, der\nKlimaanlage, der technischen Anlage sowie aller verlegten Leitungen).\n\n. De, unterlassen.\n\n Seite 2 von 10\n\nPa\n\f"'
possible_tags = ['DATE', 'TITLE']
tag_colors = {'DATE': '#379683', 'TITLE': '#ba5555'} # Redish: AC3B61
tag = possible_tags[0] # Set initial tag
entities = [{"start": 34, "end": 44, "tag": tag, "color": tag_colors[tag], "tag_id": "ifjgndsidsugn"}]

app.layout = html.Div([
    dcc.Dropdown(
        id='entitiy-dropdown',
        options=[{'label': tag_name, 'value': tag_name} for tag_name in possible_tags],
        value=tag,
        multi=False,
        searchable=True,
        clearable=False
    ),
    dash_text_annotate.DashTextAnnotate( # Put this component into a card (dash bootstrap component)
        id='annotator',
        text=text,
        entities=entities,
        tag=tag,
        tag_colors=tag_colors,
    ),
    html.H2('Dash Output:'),
    html.Div(id='output')
])


@app.callback(Output('output', 'children'), [Input('annotator', 'entities')]) # Output: div (see above), Input: selected entities
def display_output(value):
    global entities
    entities = value
    # map tag_id into entities before sending to DB
    return 'You have selected: {}'.format(value)

@app.callback(Output('annotator', 'tag'), [Input('entitiy-dropdown', 'value')])
def change_tag(value):
    return value

if __name__ == '__main__':
    app.run_server(debug=True)
