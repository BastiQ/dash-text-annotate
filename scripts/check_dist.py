"""Check distributable contents and version alignment without importing the source."""
import argparse
import email
import json
from pathlib import Path
import tarfile
import zipfile


def check(directory, tag=None):
    wheels = list(Path(directory).glob('*.whl'))
    sdists = list(Path(directory).glob('*.tar.gz'))
    if len(wheels) != 1 or len(sdists) != 1:
        raise SystemExit('Expected one wheel and one sdist. Use a clean dist directory.')
    required = {'DashTextAnnotate.py', '__init__.py', 'validation.py', 'py.typed',
                'dash_text_annotate.min.js', 'dash_text_annotate.min.css',
                'metadata.json', 'package-info.json', 'THIRD_PARTY_NOTICES.md'}
    with zipfile.ZipFile(wheels[0]) as archive:
        names = archive.namelist()
        package = {name.removeprefix('dash_text_annotate/') for name in names if name.startswith('dash_text_annotate/')}
        assert required <= package, required - package
        assert package <= required | {'_imports_.py'}, package - required
        metadata_path = next(name for name in names if name.endswith('.dist-info/METADATA'))
        metadata = email.message_from_bytes(archive.read(metadata_path))
        info = json.loads(archive.read('dash_text_annotate/package-info.json'))
        assert metadata['Name'] == 'dash-text-annotate'
        assert metadata['Version'] == info['version']
        version = metadata['Version']
        if tag:
            assert tag == f'v{version}', f'Release tag {tag!r} does not match package version v{version}'
        assert metadata['Requires-Python'] == '>=3.10'
        assert metadata['License-Expression'] == 'MIT'
        for filename in ('LICENSE', 'THIRD_PARTY_NOTICES.md'):
            assert any(name.endswith(f'.dist-info/licenses/{filename}') for name in names), filename
        assert any(req.startswith('dash<5,>=3.0') for req in metadata.get_all('Requires-Dist', []))
        assert len(archive.read('dash_text_annotate/dash_text_annotate.min.js')) > 10000
    with tarfile.open(sdists[0]) as archive:
        files = {member.name.split('/', 1)[-1]: member for member in archive.getmembers() if member.isfile()}
        sdist_metadata = email.message_from_bytes(archive.extractfile(files['PKG-INFO']).read())
        assert sdist_metadata['Name'] == metadata['Name']
        assert sdist_metadata['Version'] == version, 'Wheel and sdist versions differ'
        for filename in ('package.json', 'dash_text_annotate/package-info.json', 'package-lock.json'):
            package_info = json.load(archive.extractfile(files[filename]))
            assert package_info['version'] == version, f'{filename} version does not match {version}'
            if filename == 'package-lock.json':
                assert package_info['packages']['']['version'] == version, 'Lockfile root version differs'
        # The sdist must rebuild/install without Node.js and retain the same runtime assets.
        with zipfile.ZipFile(wheels[0]) as wheel:
            for filename in required:
                path = f'dash_text_annotate/{filename}'
                assert archive.extractfile(files[path]).read() == wheel.read(path), f'Sdist/wheel differ: {path}'
        names = [name.split('/', 1)[-1] for name in archive.getnames()]
        for name in ['package-lock.json', 'scripts/build.mjs', 'scripts/generate.py', 'licenses/recogito.txt',
                     'licenses/annotorious.txt', 'src/lib/components/DashTextAnnotate.react.js', 'usage.py', 'assets/demo.css']:
            assert name in names, f'Missing from sdist: {name}'
        assert not any('/node_modules/' in name or '-wps-hmr' in name or name.endswith(('output.js', '.map')) for name in names)
        assert not any(name.endswith(('.gif', '.mp4')) for name in names), 'Demo recordings must not ship in distributions'
    print(f'Validated {wheels[0].name} and {sdists[0].name}')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('directory', nargs='?', default='dist')
    parser.add_argument('--tag', help='Require this release tag to match the packaged version (e.g. v0.1.0)')
    arguments = parser.parse_args()
    check(arguments.directory, arguments.tag)
