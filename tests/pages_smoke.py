"""Check the production build under GitHub Pages' /DTD/ repository path.

Run npm run build first. Uses Python Playwright and a system Chromium.
"""
import os
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread
from playwright.sync_api import sync_playwright, expect

DIST = Path(__file__).resolve().parents[1] / 'dist'


class PagesHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if not self.path.startswith('/DTD/'):
            self.send_error(404)
            return
        self.path = self.path[len('/DTD'):]
        super().do_GET()

    def log_message(self, *_):
        pass


server = ThreadingHTTPServer(('127.0.0.1', 0), partial(PagesHandler, directory=str(DIST)))
Thread(target=server.serve_forever, daemon=True).start()
url = f'http://127.0.0.1:{server.server_port}/DTD/'
try:
    with sync_playwright() as p:
        browser = p.chromium.launch(
            executable_path=os.getenv('CHROMIUM_PATH', '/usr/bin/chromium'),
            headless=True, args=['--no-sandbox'],
        )
        page = browser.new_page(viewport={'width': 1440, 'height': 1000})
        errors, failed_resources, external_requests = [], [], []
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.on('response', lambda response: failed_resources.append(response.url) if response.status >= 400 else None)
        page.on('request', lambda request: external_requests.append(request.url) if not request.url.startswith(url) else None)
        page.goto(url, wait_until='networkidle')
        page.evaluate('document.fonts.ready')
        expect(page.locator('h1')).to_have_text('O caminho começa aqui.')
        expect(page.locator('.map-pad')).to_have_count(9)
        page.locator('.map-pad[data-action="place"]').first.click()
        expect(page.locator('#hud-qi')).to_have_text('130')
        page.locator('.nav-item[data-view="recruit"]').click()
        page.locator('[data-action="summon"][data-count="1"]').click()
        expect(page.locator('.summon-result-card')).to_have_count(1)
        expect(page.locator('#crystal-count')).to_have_text('200')
        page.keyboard.press('Escape')
        page.reload(wait_until='networkidle')
        expect(page.locator('#crystal-count')).to_have_text('200')
        assert not errors, errors
        assert not failed_resources, failed_resources
        assert not external_requests, external_requests
        browser.close()
        print('GitHub Pages /DTD/ production build: PASS; gameplay and persistence work; no missing or external resources.')
finally:
    server.shutdown()
    server.server_close()
