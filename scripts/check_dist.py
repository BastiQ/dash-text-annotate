"""Check distributable contents and version alignment without importing the source."""
import email
import json
from pathlib import Path
import sys
import tarfile
import zipfile


def check(directory):
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
        assert metadata['Version'] == info['version']
        assert metadata['Requires-Python'] == '>=3.10'
        assert any(req.startswith('dash<5,>=3.0') for req in metadata.get_all('Requires-Dist', []))
        assert len(archive.read('dash_text_annotate/dash_text_annotate.min.js')) > 10000
    with tarfile.open(sdists[0]) as archive:
        names = [name.split('/', 1)[-1] for name in archive.getnames()]
        for name in ['package-lock.json', 'scripts/build.mjs', 'scripts/generate.py', 'licenses/recogito.txt',
                     'licenses/annotorious.txt', 'src/lib/components/DashTextAnnotate.react.js', 'usage.py', 'assets/demo.css']:
            assert name in names, f'Missing from sdist: {name}'
        assert not any('/node_modules/' in name or '-wps-hmr' in name or name.endswith(('output.js', '.map')) for name in names)
    print(f'Validated {wheels[0].name} and {sdists[0].name}')


if __name__ == '__main__':
    check(sys.argv[1] if len(sys.argv) > 1 else 'dist')
