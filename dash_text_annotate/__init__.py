"""Text span annotation for Dash, with local JavaScript and CSS assets."""
import json
from pathlib import Path

from .DashTextAnnotate import DashTextAnnotate
from .validation import convert_offsets, validate_entities

__all__ = ["DashTextAnnotate", "convert_offsets", "validate_entities"]
__version__ = json.loads(Path(__file__).with_name("package-info.json").read_text())["version"]

_js_dist = [{"relative_package_path": "dash_text_annotate.min.js", "namespace": "dash_text_annotate"}]
_css_dist = [{"relative_package_path": "dash_text_annotate.min.css", "namespace": "dash_text_annotate"}]
DashTextAnnotate._js_dist = _js_dist
DashTextAnnotate._css_dist = _css_dist
