import os
import threading
import pytest
from werkzeug.serving import make_server


def pytest_addoption(parser):
    parser.addoption('--run-browser', action='store_true', help='Run Chrome integration tests')


def pytest_collection_modifyitems(config, items):
    if not config.getoption('--run-browser'):
        skip = pytest.mark.skip(reason='Pass --run-browser to run Chrome integration tests')
        for item in items:
            if 'browser' in item.keywords:
                item.add_marker(skip)


@pytest.fixture(scope='session')
def app_url():
    from browser_app import make_app
    server = make_server('127.0.0.1', 0, make_app().server, threaded=True)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    yield f'http://127.0.0.1:{server.server_port}'
    server.shutdown()
    thread.join(timeout=5)
    server.server_close()


@pytest.fixture
def browser(app_url):
    from selenium import webdriver
    from selenium.webdriver.chrome.options import Options
    from selenium.webdriver.support.ui import WebDriverWait
    options = Options()
    for argument in ['--headless=new', '--no-sandbox', '--disable-dev-shm-usage', '--window-size=1280,1000']:
        options.add_argument(argument)
    if os.getenv('CHROME_BINARY'):
        options.binary_location = os.environ['CHROME_BINARY']
    options.set_capability('goog:loggingPrefs', {'browser': 'ALL'})
    driver = webdriver.Chrome(options=options)
    driver.get(app_url)
    WebDriverWait(driver, 10).until(lambda d: d.find_elements('css selector', '#annotator .dta-document'))
    yield driver
    errors = [e for e in driver.get_log('browser') if e['level'] == 'SEVERE']
    driver.quit()
    assert not errors
