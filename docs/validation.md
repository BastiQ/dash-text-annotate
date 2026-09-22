# Modernization validation

Local verification on 22 September 2026, using Python 3.13 on macOS:

- Eight JavaScript model/history/search regression tests passed.
- Sixteen Python tests passed against Dash 3.0.0 and Dash 4.4.1, including real Flask callback requests for validated saving and JSON export.
- Installed-wheel asset serving and imports passed outside the source checkout on both Dash versions.
- A clean extraction of the sdist installed with `npm ci`; `npm run build` reproduced all eight generated files byte for byte.
- Wheel and sdist contents passed `scripts/check_dist.py`; both passed `twine check`.
- `npm audit` reported zero known vulnerabilities in the locked dependency tree.
- Interactive browser checks on Dash 4 covered mouse selection, keyboard passage search, emoji offsets, undo/redo, overlap rendering, invalid spans, stale-document clearing, saved-data loading, relabeling with metadata retention, read-only controls, cross-boundary rejection, and editing after a second component was removed.
- Interactive browser checks of the installed wheel on Dash 3 covered repeated passage matches, Python offsets, undo, overlapping highlights, and callback round trips. No browser error/warning logs appeared in these checks.
- Demo checks confirmed session persistence after reload, independent documents, a successful JSON upload, and a narrow layout without horizontal overflow.
- Independent review identified and re-reviewed fixes for JSON field-order comparisons and multiline keyboard annotation. Follow-up browser checks confirmed Ctrl/Cmd+Enter submission, preserved undo after reordered callback responses, and clearing reordered old spans on document changes. These checks produced no browser warnings or errors; unit tests also cover original LF/CRLF/CR offsets and nested metadata.

Eight Selenium regression scenarios are included and collect successfully. They were not executed through Selenium locally; the corresponding interaction checks used the desktop browser tools. The GitHub workflow is configured to execute them against installed wheels on Python 3.10/Dash 3.0.0, Python 3.13/Dash 4.4.1, and Python 3.14/Dash 4.4.1. That hosted matrix must pass before publication. No package or release has been published as part of this work.

This is a beta release. These checks are not a WCAG certification or a performance guarantee for large documents; broader assistive-technology, touch, and downstream application testing remains appropriate before 1.0.
