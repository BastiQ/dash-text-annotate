"""Run outside the checkout after installing a wheel in a clean environment."""
from pathlib import Path
from importlib.metadata import version
from dash import Dash
import dash
import dash_text_annotate as dta

source_root = Path(__file__).resolve().parents[1]
assert not Path(dta.__file__).resolve().is_relative_to(source_root), 'Imported source instead of installed wheel'
assert dta.__version__ == version('dash-text-annotate'), 'Installed metadata and runtime versions differ'
app = Dash(__name__)
app.layout = dta.DashTextAnnotate(text='😀 Acme', tag='ORG')
client = app.server.test_client()
assert client.get('/').status_code == 200
assert client.get('/_dash-layout').status_code == 200
for asset in dta._js_dist + dta._css_dist:
    path = asset['relative_package_path']
    assert client.get(f'/_dash-component-suites/dash_text_annotate/{path}').status_code == 200
assert dta.convert_offsets('😀 Acme', [{'start': 3, 'end': 7, 'tag': 'ORG'}])[0]['start'] == 2
print(f'Installed wheel {dta.__version__} works with Dash {dash.__version__}: {dta.__file__}')
