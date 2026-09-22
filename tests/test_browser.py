"""Regression scenarios against an actual Dash app and its callback round trips."""
import json
import pytest
from selenium.webdriver import ActionChains
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from .browser_app import TEXT

pytestmark = pytest.mark.browser


def element(driver, selector):
    return driver.find_element('css selector', selector)


def entities(driver):
    return json.loads(element(driver, '#output').text or '[]')


def wait(driver, condition):
    return WebDriverWait(driver, 10).until(condition)


def button(driver, text):
    return driver.find_element('xpath', f'//section[@id="annotator"]//button[normalize-space()="{text}"]')


def add_passage(driver, passage):
    details = element(driver, '#annotator details')
    if not details.get_attribute('open'):
        element(driver, '#annotator summary').click()
    field = element(driver, '#annotator textarea')
    field.clear()
    field.send_keys(passage)
    field.send_keys(Keys.CONTROL, Keys.ENTER)


def drag_text(driver, start, end):
    doc = element(driver, '#annotator .dta-document')
    # Measure the actual text node; do not depend on fonts or screen coordinates.
    rects = driver.execute_script('''
      const el=arguments[0], node=el.firstChild;
      const points=[arguments[1],arguments[2]].map(offset=>{
        const range=document.createRange(); range.setStart(node,offset); range.setEnd(node,offset);
        const r=range.getBoundingClientRect(); return {x:r.x,y:r.y+r.height/2};
      }); const r=el.getBoundingClientRect();
      return {points,center:{x:r.x+r.width/2,y:r.y+r.height/2}};
    ''', doc, start, end)
    a, b = rects['points']
    c = rects['center']
    ActionChains(driver).move_to_element_with_offset(doc, a['x']-c['x'], a['y']-c['y']).click_and_hold().pause(.1).move_by_offset(b['x']-a['x'], b['y']-a['y']).pause(.2).release().perform()


def test_keyboard_unicode_repeated_matches_and_history(browser):
    add_passage(browser, 'Acme')
    wait(browser, lambda _: len(entities(browser)) == 1)
    first = entities(browser)[0]
    assert (first['start'], first['end'], first['text']) == (2, 6, 'Acme')
    assert TEXT[first['start']:first['end']] == first['text']
    button(browser, 'Next match').click()
    button(browser, 'Add annotation').click()
    wait(browser, lambda _: len(entities(browser)) == 2)
    assert entities(browser)[1]['start'] == TEXT.index('Acme', 3)
    button(browser, 'Undo').click()
    wait(browser, lambda _: entities(browser) == [first])
    button(browser, 'Redo').click()
    wait(browser, lambda _: len(entities(browser)) == 2)
    assert entities(browser)[0]['id'] == first['id']
    element(browser, '#annotator .dta-remove').click()
    wait(browser, lambda _: len(entities(browser)) == 1)
    button(browser, 'Undo').click()
    wait(browser, lambda _: len(entities(browser)) == 2)


def test_mouse_selection_and_multiple_instances(browser):
    drag_text(browser, 3, 7)  # Browser UTF-16 positions, after emoji.
    wait(browser, lambda _: len(entities(browser)) == 1)
    assert entities(browser)[0]['text'] == 'Acme'
    assert entities(browser)[0]['start'] == 2
    element(browser, '#unmount').click()
    wait(browser, lambda _: not browser.find_elements('css selector', '#secondary'))
    add_passage(browser, 'Berlin')
    wait(browser, lambda _: len(entities(browser)) == 2)


def test_keyboard_multiline_passage(browser):
    passage = 'Berlin.\nAcme'
    add_passage(browser, passage)
    wait(browser, lambda _: len(entities(browser)) == 1)
    annotation = entities(browser)[0]
    assert annotation['text'] == passage
    assert TEXT[annotation['start']:annotation['end']] == passage
    assert element(browser, '#annotator .dta-document').get_attribute('textContent') == TEXT


def test_reordered_callback_echo_preserves_undo(browser):
    element(browser, '#annotated').click()
    wait(browser, lambda _: len(entities(browser)) == 1)
    original = entities(browser)[0]
    add_passage(browser, 'ready')
    wait(browser, lambda _: len(entities(browser)) == 2)
    element(browser, '#echo').click()
    wait(browser, lambda _: list(entities(browser)[0]) == sorted(entities(browser)[0]))
    assert button(browser, 'Undo').is_enabled()
    button(browser, 'Undo').click()
    wait(browser, lambda _: entities(browser) == [original])


def test_reordered_old_spans_are_cleared_on_document_switch(browser):
    element(browser, '#overlaps').click()
    wait(browser, lambda _: len(entities(browser)) == 2)
    element(browser, '#new-reordered').click()
    wait(browser, lambda _: element(browser, '#annotator .dta-document').text == 'A different document.')
    wait(browser, lambda _: entities(browser) == [])
    assert not browser.find_elements('css selector', '#annotator .dta-annotation')
    assert not button(browser, 'Undo').is_enabled()


def test_overlap_invalid_input_and_document_replacement(browser):
    element(browser, '#overlaps').click()
    wait(browser, lambda _: len(browser.find_elements('css selector', '#annotator .dta-annotation')) == 2)
    assert element(browser, '#annotator .dta-document').get_attribute('textContent') == TEXT
    element(browser, '#invalid').click()
    wait(browser, lambda _: 'offsets' in element(browser, '#error-output').text)
    assert not browser.find_elements('css selector', '#annotator .r6o-annotation')
    assert element(browser, '#annotator .dta-document').get_attribute('textContent') == TEXT
    element(browser, '#overlaps').click()
    wait(browser, lambda _: element(browser, '#error-output').text == '')
    element(browser, '#new').click()
    wait(browser, lambda _: entities(browser) == [])
    assert element(browser, '#annotator .dta-document').text == 'A different document.'
    assert not button(browser, 'Undo').is_enabled()


def test_saved_metadata_relabel_and_read_only(browser):
    element(browser, '#annotated').click()
    wait(browser, lambda _: len(entities(browser)) == 1)
    element(browser, '#label').click()
    wait(browser, lambda _: 'PERSON' in element(browser, '#annotator .dta-active-label').text)
    element(browser, '#annotator .dta-annotation').click()
    wait(browser, lambda _: button(browser, 'Apply label').is_enabled())
    button(browser, 'Apply label').click()
    wait(browser, lambda _: entities(browser)[0]['tag'] == 'PERSON')
    assert entities(browser)[0]['id'] == 'loaded'
    assert entities(browser)[0]['note'] == 'retain'
    element(browser, '#readonly').click()
    wait(browser, lambda _: not browser.find_elements('css selector', '#annotator .dta-remove'))
    saved = entities(browser)
    drag_text(browser, 5, 7)
    assert entities(browser) == saved


def test_selection_crossing_document_boundary_is_rejected(browser):
    outside = element(browser, '#outside')
    doc = element(browser, '#annotator .dta-document')
    ActionChains(browser).move_to_element(outside).click_and_hold().pause(.1).move_to_element_with_offset(doc, -doc.size['width']/2+75, -doc.size['height']/2+30).pause(.2).release().perform()
    wait(browser, lambda _: 'entirely inside' in element(browser, '#annotator .dta-status').text)
    assert entities(browser) == []
