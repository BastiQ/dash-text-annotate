# Dash community announcement draft

Maintainer notes: post only after `pip install dash-text-annotate==0.1.0` works from public PyPI and the documentation is merged. Category: **Dash Python**. Tags: **community-components**, **show-and-tell**. Use the [GitHub-hosted demo](../README.md#demo). Copy the text below into the forum topic; these notes are not part of the announcement.

---

**Title: Dash Text Annotate 0.1.0 — text span annotation inside your Dash app**

I've released Dash Text Annotate, an open-source component for selecting and labeling passages in a Dash app. It works with plain text and returns structured annotations to ordinary Python callbacks.

Use it to mark people, organizations, dates, or your own categories in documents. It supports overlapping labels, visible passage badges, keyboard passage search, relabeling, undo/redo, and read-only review. Your app controls storage and document loading.

```sh
python -m pip install dash-text-annotate==0.1.0
```

Here's a complete small app:

```python
import json
from dash import Dash, Input, Output, html
from dash_text_annotate import DashTextAnnotate

app = Dash(__name__)
app.layout = html.Div([
    DashTextAnnotate(
        id="annotator",
        text="Acme opened an office in Berlin.",
        tag="ORG",
        tag_colors={"ORG": "#79b9a5"},
    ),
    html.Pre(id="annotations"),
])

@app.callback(Output("annotations", "children"), Input("annotator", "entities"))
def show_annotations(entities):
    return json.dumps(entities or [], ensure_ascii=False, indent=2)

if __name__ == "__main__":
    app.run(debug=True)
```

Each annotation has a stable ID, start/end offsets, the selected text, and a label. The default offsets are Python Unicode code-point indices, so `text[start:end]` gives you the exact passage, including when the document contains emoji.

Python 3.10+ and Dash 3/4 are supported. The package includes its JavaScript and CSS; there is no Node.js installation or CDN requirement for users. It is MIT licensed and powered by Recogito Text Annotator.

Version 0.1.0 is a breaking beta following an older prototype. Existing users should read the migration guide, especially the change from UTF-16 to code-point offsets. The component handles annotation; storage, authentication, and multi-user collaboration belong to the surrounding app.

- [Source, demo instructions, and documentation](https://github.com/BastiQ/dash-text-annotate)
- [PyPI](https://pypi.org/project/dash-text-annotate/)
- [Component reference](https://github.com/BastiQ/dash-text-annotate/blob/main/docs/reference.md)
- [Migration guide](https://github.com/BastiQ/dash-text-annotate/blob/main/docs/migration.md)

Feedback and small reproducible examples are welcome in the [issue tracker](https://github.com/BastiQ/dash-text-annotate/issues), especially experiences with different documents, keyboard workflows, and Dash themes.
