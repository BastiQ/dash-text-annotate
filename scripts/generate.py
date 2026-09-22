"""Use Dash's Python generator with metadata produced by current react-docgen."""
import json
from pathlib import Path
from dash.development.component_generator import generate_components

generate_components(
    "src/lib/components", "dash_text_annotate",
    package_info_filename="package-info.json",
    metadata=json.loads(Path("dash_text_annotate/metadata.json").read_text()),
)
