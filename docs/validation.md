# Modernization validation

Local verification on 22 September 2026, using Python 3.13 on macOS:

- Thirteen JavaScript model/history/search/label-layout regression tests passed.
- Sixteen Python tests passed against Dash 3.0.0 and Dash 4.4.1, including real Flask callback requests for validated saving and JSON export.
- Installed-wheel asset serving and imports passed outside the source checkout on both Dash versions.
- A clean extraction of the sdist installed with `npm ci`; `npm run build` reproduced all eight generated files byte for byte.
- Wheel and sdist contents passed `scripts/check_dist.py`; both passed `twine check`.
- `npm audit` reported zero known vulnerabilities in the locked dependency tree.
- Interactive browser checks on Dash 4 covered mouse selection, keyboard passage search, emoji offsets, undo/redo, overlap rendering, invalid spans, stale-document clearing, saved-data loading, relabeling with metadata retention, read-only controls, cross-boundary rejection, and editing after a second component was removed.
- Interactive browser checks of the installed wheel on Dash 3 covered repeated passage matches, Python offsets, undo, overlapping highlights, and callback round trips. No browser error/warning logs appeared in these checks.
- Demo checks confirmed session persistence after reload, independent documents, a successful JSON upload, and a narrow layout without horizontal overflow.
- Independent review identified and re-reviewed fixes for JSON field-order comparisons and multiline keyboard annotation. Follow-up browser checks confirmed Ctrl/Cmd+Enter submission, preserved undo after reordered callback responses, and clearing reordered old spans on document changes. These checks produced no browser warnings or errors; unit tests also cover original LF/CRLF/CR offsets and nested metadata.
- Passage-label renderer checks on Dash 4 covered real mouse creation after emoji, keyboard badge selection, overlapping and wrapped spans at a 540 px viewport, read-only selection, document cleanup, and toggling labels without losing selection or undo. Source text stayed unchanged. The Python API accepts `show_labels=False`, and generated metadata/bindings agree.
- The rebuilt wheel was installed outside the checkout on Dash 3. Browser checks confirmed keyboard creation, badge selection, visibility callbacks, and undo. No browser warnings or errors appeared in the Dash 3 or Dash 4 renderer checks.
- Position controls were checked on Dash 4 and an installed Dash 3 wheel: right is the default; switching left/top/bottom/right retained selected IDs, source text, and annotation values. Real mouse selection across an inline label produced `Acme works` at Python offsets 2–12 after an emoji, and undo restored the original annotation. Dash 4 checks also covered crowded labels in all four positions at 540 px, visibility changes, read-only badge selection, and document replacement. No browser warnings or errors appeared.

The original interaction checks above used the desktop browser tools. The release-preparation checks below subsequently ran the eleven Selenium scenarios locally. The GitHub workflow is configured to execute them against installed wheels on Python 3.10/Dash 3.0.0, Python 3.13/Dash 4.4.1, and Python 3.14/Dash 4.4.1. That hosted matrix must pass before publication. No package or release has been published as part of this work.

This is a beta release. These checks are not a WCAG certification or a performance guarantee for large documents; broader assistive-technology, touch, and downstream application testing remains appropriate before 1.0.

## Release preparation — 22 September 2026

- Kept the planned package version at 0.1.0. GitHub confirmed `BastiQ/dash-text-annotate` as the public repository, and PyPI's JSON endpoint returned 404 for the package name. Publication and account setup remain separate steps.
- Fixed a transient Selenium stale-element failure seen in the previous hosted CI run: document switching can replace a node between finding it and reading its text. Polling retries that read within the existing ten-second timeout.
- All 27 Python tests, including all eleven Chrome scenarios, passed locally on Python 3.13.13/Dash 4.4.1.
- Fresh wheel installations outside the checkout passed `pip check`, runtime/metadata version agreement, imports, and local asset serving. All 23 installed-wheel browser/package/validation tests passed on both Dash 3.0.0 and Dash 4.4.1 with Python 3.13.13.
- The source archive installed in another clean environment and passed dependency, version, and asset checks without a frontend build.
- A clean temporary source copy passed all thirteen JavaScript tests, reported zero known npm vulnerabilities, and reproduced all eight generated files byte for byte. The local frontend build used Node 26.8.2; hosted CI retains Node 24 from `.nvmrc`.
- Wheel and sdist passed strict Twine validation and the expanded distribution checks for versions, licenses, required assets, and excluded recordings. Deliberately mismatched tags, a stale lockfile version, and missing CSS were rejected.
- Both GitHub workflows passed actionlint 1.7.12. Publication uses the existing CI as a reusable gate, with different concurrency groups for ordinary CI and release validation. The exact tested artifacts are passed to the upload jobs.

These checks do not constitute a hosted run of the new workflow, a TestPyPI rehearsal, or a PyPI publication. The release workflow requires the full hosted compatibility matrix to pass before uploading. See the [release guide](releasing.md) for account configuration and the remaining publication steps.
