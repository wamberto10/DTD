"""Browser integration checks. Requires Python Playwright and a system Chromium.

Start `npm run dev` first, then `python3 tests/battle_smoke.py`.
"""
import json
import os
from playwright.sync_api import sync_playwright, expect

BASE_URL = os.getenv('DTD_TEST_URL', 'http://127.0.0.1:5173')
CHROMIUM = os.getenv('CHROMIUM_PATH', '/usr/bin/chromium')

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=CHROMIUM, headless=True, args=['--no-sandbox'])
    page = browser.new_page(viewport={'width': 1440, 'height': 1050})
    errors = []
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.clock.install()
    page.goto(BASE_URL, wait_until='networkidle')
    expect(page.locator('h1')).to_have_text('O caminho começa aqui.')
    expect(page.locator('.map-pad')).to_have_count(9)
    for pad in ['p1', 'p2', 'p4']:
        page.locator(f'[data-action="place"][data-id="{pad}"]').click()
    expect(page.locator('.map-tower')).to_have_count(3)
    expect(page.locator('#hud-qi')).to_have_text('30')

    # A selected tower exposes its range and cannot spend unavailable Qi.
    page.locator('.map-tower').first.click()
    expect(page.locator('.tower-range')).to_have_count(1)
    expect(page.locator('[data-action="upgrade"]')).to_be_disabled()
    page.locator('[data-action="deselect-tower"]').click()
    page.locator('[data-action="speed"]').click()
    expect(page.locator('#speed-text')).to_have_text('2×')
    page.locator('[data-action="wave"]').click()
    page.clock.run_for(1000)
    expect(page.locator('.enemy')).not_to_have_count(0)
    page.locator('[data-action="wave"]').click()
    expect(page.locator('#pause-overlay')).to_be_visible()
    before = page.locator('#enemy-layer').inner_html()
    page.clock.run_for(2000)
    assert page.locator('#enemy-layer').inner_html() == before, 'Paused enemies must not move'
    page.locator('[data-action="pause"]').click()

    for wave in range(1, 6):
        page.clock.run_for(20000)
        if wave < 5:
            expect(page.locator('#battle-status-text')).to_have_text('Entre ondas')
            # Spend earned Qi through the real improvement UI between waves.
            for tower in page.locator('.map-tower').all():
                tower.click()
                upgrade = page.locator('[data-action="upgrade"]')
                if upgrade.is_enabled():
                    upgrade.click()
                page.locator('[data-action="deselect-tower"]').click()
            page.locator('[data-action="wave"]').click()

    expect(page.locator('#modal-title')).to_have_text('O vale está a salvo.')
    expect(page.locator('.victory-reward')).to_contain_text('+150 Cristais do Dao')
    expect(page.locator('#hud-lives')).to_have_text('20')
    profile = page.evaluate("JSON.parse(localStorage.getItem('dtd-dao-profile-v1'))")
    assert profile['crystals'] == 450
    assert profile['completedStages'] == [1]
    assert profile['unlockedStage'] == 2
    page.screenshot(path='/tmp/dtd-victory.png', full_page=True)
    page.locator('[data-action="result-next"]').click()
    expect(page.locator('.map-title strong')).to_have_text('Bosque Espiritual')
    expect(page.locator('#hud-qi')).to_have_text('180')
    expect(page.locator('.map-tower')).to_have_count(0)
    expect(page.locator('#hud-lives')).to_have_text('20')
    page.locator('[data-action="stages"]').click()
    expect(page.locator('[data-action="choose-stage"][data-id="3"]')).to_be_disabled()
    page.keyboard.press('Escape')
    assert not errors, errors
    print(json.dumps({'battle': 'passed', 'victory': True, 'crystals': 450,
                      'unlockedStage': 2, 'transientUpgradesReset': True, 'browserErrors': errors}))
    browser.close()
