# Releasing Dash Text Annotate

The next release is **0.1.0**, a breaking beta following the historical 0.0.1 prototype. Python users install `dash-text-annotate` and import `dash_text_annotate`. The wheel includes the generated Python component, JavaScript, CSS, validation helpers, and licenses. End users need neither Node.js nor a separate npm package.

This repository is prepared for publication; these instructions do not mean a release has already been uploaded. The PyPI project lookup returned no public project on 22 September 2026. Confirm the name and account access when setting up the publisher; a missing project page does not reserve the name.

## One-time account setup

Use [PyPI Trusted Publishing](https://docs.pypi.org/trusted-publishers/using-a-publisher/) so GitHub Actions can upload without a stored API token.

1. Sign in to PyPI and TestPyPI (separate accounts) and complete their account requirements.
2. In [GitHub repository environments](https://github.com/BastiQ/dash-text-annotate/settings/environments), create `testpypi` and `pypi`. Restrict deployments to version tags matching `v*`; adding a required reviewer for `pypi` gives a final publication checkpoint.
3. For a new project, add a [pending publisher on PyPI](https://pypi.org/manage/account/publishing/). If you already own the project, add it under that project's Publishing settings. Configure these exact fields:

| Field | PyPI | TestPyPI |
| --- | --- | --- |
| Project name | `dash-text-annotate` | `dash-text-annotate` |
| GitHub owner | `BastiQ` | `BastiQ` |
| Repository | `dash-text-annotate` | `dash-text-annotate` |
| Workflow filename | `publish.yml` | `publish.yml` |
| Environment | `pypi` | `testpypi` |

Create the TestPyPI publisher at [TestPyPI's account publishing page](https://test.pypi.org/manage/account/publishing/). The publish jobs live in `publish.yml`; `ci.yml` is only a reusable validation workflow. Keep the owner and repository fields aligned if the repository is transferred.

## Prepare and check the release

Use Python 3.13 and the Node version in `.nvmrc` for release builds. The package itself supports Python 3.10+.

1. Start with the [development setup and checks](../CONTRIBUTING.md). For future releases, change `pyproject.toml` and `package.json` together, then run `npm install --package-lock-only` and `npm run build`. The build refreshes `dash_text_annotate/package-info.json`, which supplies `__version__`. Keep npm's `private: true`: distribution is through PyPI.
2. Update the README install version, changelog, migration notes, and [announcement draft](community-announcement.md). Add the intended release date to the changelog before tagging the final commit. Do not tag a commit that still needs release edits.
3. Run the checks and build into a new, empty directory so old releases cannot be uploaded by accident:

   ```sh
   npm test
   npm run build
   python -m pytest --run-browser
   npm audit --audit-level=high
   python -m build --outdir dist/0.1.0
   python -m twine check --strict dist/0.1.0/*
   python scripts/check_dist.py dist/0.1.0 --tag v0.1.0
   ```

   For `0.1.0`, this produces `dash_text_annotate-0.1.0-py3-none-any.whl` and `dash_text_annotate-0.1.0.tar.gz`. The checks require matching versions in wheel/sdist metadata, npm metadata and lockfile, bundled assets, and the release tag. Demo recordings and build dependencies are excluded.

4. Install the wheel in a fresh virtual environment outside the checkout, run `python -m pip check`, and run `python /absolute/path/to/repository/scripts/check_installed.py` from there. Also install the sdist in another clean environment to confirm that installation needs no frontend build.
5. Commit the release changes and merge them into `master`. Require CI to pass, including the installed-wheel Chrome matrix on Python 3.10/Dash 3.0.0, Python 3.13/Dash 4.4.1, and Python 3.14/Dash 4.4.1. The publication workflow must exist on the default branch before manual dispatch is available.
6. Tag the reviewed release commit `v0.1.0` and push that tag. Future releases use their matching version tags. Tag pushes run CI; they do not publish a package.

## Rehearse on TestPyPI

Run the **Publish packages** workflow on the version tag. For example, using GitHub CLI:

```sh
gh workflow run publish.yml --repo BastiQ/dash-text-annotate --ref v0.1.0
```

A manual run only targets TestPyPI. It rebuilds and tests the tagged commit through the full CI matrix before uploading those exact artifacts. A branch reference or mismatched package/tag version fails before upload.

Test installation in a clean environment, installing dependencies from ordinary PyPI first (TestPyPI may not contain them):

```sh
python -m pip install 'dash>=3.0,<5'
python -m pip install --index-url https://test.pypi.org/simple/ --no-deps dash-text-annotate==0.1.0
python -m pip check
python -c "from dash_text_annotate import DashTextAnnotate, __version__; print(__version__)"
```

Run `scripts/check_installed.py` outside the source checkout and inspect the TestPyPI project page, including the README, image, and documentation links. The README uses absolute GitHub URLs so these work on PyPI after the release changes are merged.

## Publish to PyPI

Create a GitHub Release for the tested tag and copy the corresponding changelog entry into its release notes. **Publishing the GitHub Release triggers the PyPI upload** after a fresh full CI run. A draft release does not upload anything. Approve the `pypi` environment deployment if you configured a reviewer.

The publication jobs download the distributions tested in that workflow run; they do not rebuild with publication credentials. Only the upload job has `id-token: write`, and the official PyPA action handles the upload and attestations. No PyPI token belongs in the repository or GitHub secrets.

PyPI release files cannot be overwritten. Do not move a released tag or enable `skip-existing` to hide a partial/failed upload. Inspect the publishing run and the package index before retrying; code or packaging changes require a new version.

After publication, verify from a new environment outside the checkout:

```sh
python -m pip install dash-text-annotate==0.1.0
python -m pip check
python -c "from dash_text_annotate import DashTextAnnotate, __version__; print(__version__)"
```

Run `scripts/check_installed.py` again and start the small README app. Check the [PyPI page](https://pypi.org/project/dash-text-annotate/) and release notes before announcing availability.

## Share with the Dash community

Use the [announcement draft](community-announcement.md) after confirming the public install works. Create a topic in **Dash Python** with **`community-components`** and **`show-and-tell`** tags. This is the submission process described in the [Community Components Index](https://community.plotly.com/t/community-components-index/60098); inclusion is maintained by the forum team.

Include the repository, PyPI link, a short runnable app, and the recorded demo. Upload the local `upload-media/annotation-demo.mp4` or GIF to GitHub/the forum and use the resulting public attachment URL. Recordings are deliberately outside the package. Forum posting and index inclusion are separate from publishing the Python package.
