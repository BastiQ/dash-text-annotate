"""Regression scenarios against an actual Dash app and its callback round trips."""
import json
import pytest
from selenium.webdriver import ActionChains
from selenium.common.exceptions import StaleElementReferenceException
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from .browser_app import TEXT, CROWDED_TEXT

pytestmark = pytest.mark.browser


def element(driver, selector):
    return driver.find_element('css selector', selector)


def entities(driver):
    return json.loads(element(driver, '#output').text or '[]')


def wait(driver, condition):
    # Document switches replace DOM nodes between locating and reading them.
    # Retry the locator on the next poll while retaining the original timeout.
    return WebDriverWait(driver, 10, ignored_exceptions=(StaleElementReferenceException,)).until(condition)


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
      const el=arguments[0];
      const points=[arguments[1],arguments[2]].map((offset,index)=>{
        const walker=document.createTreeWalker(el.querySelector('.dta-source'),NodeFilter.SHOW_TEXT);
        let node=walker.nextNode();
        while(node && (offset>node.length || (offset===node.length && index===0))) {
          offset-=node.length; node=walker.nextNode();
        }
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
    wait(browser, lambda _: not browser.find_elements('css selector', '#annotator .dta-highlight'))
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


def test_optional_labels_preserve_selection_data_and_history(browser):
    add_passage(browser, 'Acme')
    wait(browser, lambda _: len(entities(browser)) == 1)
    wait(browser, lambda _: len(browser.find_elements('css selector', '#annotator .dta-label-button')) == 1)
    original = entities(browser)
    badge = element(browser, '#annotator .dta-label-button')
    badge.send_keys(Keys.ENTER)
    wait(browser, lambda _: element(browser, '#selected-output').text == original[0]['id'])
    element(browser, '#labels').click()
    wait(browser, lambda _: not browser.find_elements('css selector', '#annotator .dta-label-button'))
    assert entities(browser) == original
    assert button(browser, 'Undo').is_enabled()
    assert element(browser, '#selected-output').text == original[0]['id']
    element(browser, '#labels').click()
    wait(browser, lambda _: len(browser.find_elements('css selector', '#annotator .dta-label-button')) == 1)
    assert element(browser, '#annotator .dta-document').get_attribute('textContent') == TEXT
    button(browser, 'Undo').click()
    wait(browser, lambda _: entities(browser) == [])
    wait(browser, lambda _: not browser.find_elements('css selector', '#annotator .dta-label-button'))


def test_overlapping_labels_wrap_resize_and_document_cleanup(browser):
    element(browser, '#crowded').click()
    wait(browser, lambda _: len(browser.find_elements('css selector', '#annotator .dta-label-button')) == 3)
    for width, position in [(540, 'right'), (540, 'left'), (540, 'top'), (540, 'bottom'), (1000, 'right')]:
        browser.set_window_size(width, 1100)
        element(browser, f'#position-{position}').click()
        def labels_fit(_):
            return browser.execute_script('''
                const doc=document.querySelector('#annotator .dta-document').getBoundingClientRect();
                const labels=[...document.querySelectorAll('#annotator .dta-label-button')].map(el=>el.getBoundingClientRect());
                return labels.length===3 && labels.every((a,i)=>a.left>=doc.left && a.right<=doc.right && a.top>=doc.top && a.bottom<=doc.bottom &&
                  labels.every((b,j)=>i===j || a.right<=b.left || b.right<=a.left || a.bottom<=b.top || b.bottom<=a.top));
            ''')
        wait(browser, labels_fit)
        assert element(browser, '#annotator .dta-document').get_attribute('textContent') == CROWDED_TEXT
        assert len(browser.find_elements('css selector', '#annotator .dta-highlight[data-annotation="overlap-0"]')) >= 2
    element(browser, '#annotator .dta-label-button').click()
    wait(browser, lambda _: element(browser, '#selected-output').text.startswith('overlap-'))
    element(browser, '#readonly').click()
    wait(browser, lambda _: not browser.find_elements('css selector', '#annotator .dta-remove'))
    assert len(browser.find_elements('css selector', '#annotator .dta-label-button')) == 3
    element(browser, '#new').click()
    wait(browser, lambda _: not browser.find_elements('css selector', '#annotator .dta-label-button'))
    assert len(browser.find_elements('css selector', '#annotator .dta-labels')) == 1
    assert len(browser.find_elements('css selector', '#annotator .dta-highlights')) == 1


def test_label_positions_preserve_source_selection_and_history(browser):
    add_passage(browser, 'Acme')
    wait(browser, lambda _: len(entities(browser)) == 1)
    original = entities(browser)
    wait(browser, lambda _: len(browser.find_elements('css selector', '#annotator .dta-label-button')) == 1)
    element(browser, '#annotator .dta-label-button').click()
    wait(browser, lambda _: element(browser, '#selected-output').text == original[0]['id'])
    # Check the default right position before explicitly setting it again.
    for index, position in enumerate(['right', 'left', 'top', 'bottom', 'right']):
        if index:
            element(browser, f'#position-{position}').click()
        def positioned(_):
            return browser.execute_script('''
                const label=document.querySelector('#annotator .dta-label-button').getBoundingClientRect();
                const highlight=document.querySelector('#annotator .dta-highlight').getBoundingClientRect();
                const side=arguments[0];
                if(side==='left') return label.right<=highlight.left && label.top<highlight.bottom && label.bottom>highlight.top;
                if(side==='right') return label.left>=highlight.right && label.top<highlight.bottom && label.bottom>highlight.top;
                if(side==='top') return label.bottom<=highlight.top;
                return label.top>=highlight.bottom;
            ''', position)
        wait(browser, positioned)
        assert entities(browser) == original
        assert element(browser, '#annotator .dta-document').get_attribute('textContent') == TEXT
        assert element(browser, '#selected-output').text == original[0]['id']
        assert button(browser, 'Undo').is_enabled()
    # Creating a span across a reserved slot must still select only source text.
    drag_text(browser, 3, 13)
    wait(browser, lambda _: len(entities(browser)) == 2)
    assert entities(browser)[1]['text'] == 'Acme works'
    assert (entities(browser)[1]['start'], entities(browser)[1]['end']) == (2, 12)
    button(browser, 'Undo').click()
    wait(browser, lambda _: entities(browser) == original)
