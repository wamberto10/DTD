"""Browser checks: run the Vite server, then python3 tests/recruitment_smoke.py.

Uses the host's Playwright package and Chromium; no browser download is required.
DTD_TEST_URL may override the default http://127.0.0.1:5173.
"""

import json
import os
import unittest

from playwright.sync_api import expect, sync_playwright


BASE_URL = os.environ.get("DTD_TEST_URL", "http://127.0.0.1:5173")
STORAGE_KEY = "dtd-dao-profile-v1"


class RecruitmentSmoke(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.playwright = sync_playwright().start()
        cls.browser = cls.playwright.chromium.launch(
            executable_path=os.environ.get("CHROMIUM_PATH", "/usr/bin/chromium"),
            headless=True,
            args=["--no-sandbox"],
        )

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.playwright.stop()

    def setUp(self):
        self.context = self.browser.new_context(viewport={"width": 1440, "height": 1000})
        # Pick Incomum, then the second hero of that pool: Han Feng.
        self.context.add_init_script("Math.random = () => 0.5")
        self.page = self.context.new_page()
        self.errors = []
        self.page.on("pageerror", lambda error: self.errors.append(str(error)))
        self.page.goto(BASE_URL, wait_until="networkidle")
        expect(self.page.locator("#crystal-count")).to_have_text("300")

    def tearDown(self):
        self.context.close()
        self.assertEqual(self.errors, [], "Browser raised an uncaught application error")

    def navigate(self, view):
        self.page.locator(f'.nav-item[data-view="{view}"]').click()

    def stored_profile(self):
        return json.loads(self.page.evaluate("key => localStorage.getItem(key)", STORAGE_KEY))

    def summon(self):
        self.page.locator('[data-action="summon"][data-count="1"]').click()
        expect(self.page.get_by_role("dialog")).to_be_visible()
        expect(self.page.locator(".summon-result-card h3")).to_have_text("Han Feng")

    def assert_no_overflow(self):
        self.assertLessEqual(
            self.page.evaluate("document.documentElement.scrollWidth"),
            self.page.evaluate("window.innerWidth"),
            "Page has horizontal document overflow",
        )

    def test_recruit_collection_deployment_and_persistence(self):
        self.navigate("recruit")
        expect(self.page.get_by_role("heading", name="Pavilhão de recrutamento.")).to_be_visible()
        expect(self.page.locator(".probability-grid > div")).to_have_count(7)
        for label in ["45%", "25%", "15%", "9%", "4,5%", "1,2%", "0,3%"]:
            expect(self.page.locator(".probability-grid").get_by_text(label, exact=True)).to_be_visible()
        expect(self.page.locator('[data-action="summon"][data-count="10"]')).to_be_disabled()

        self.summon()
        expect(self.page.locator("#crystal-count")).to_have_text("200")
        expect(self.page.locator(".new-badge")).to_have_text("NOVO")
        first = self.stored_profile()
        self.assertEqual(first["owned"], ["faxineiro", "han-feng"])
        self.assertEqual(first["copies"]["han-feng"], 1)
        self.assertEqual(first["totalSummons"], 1)
        self.page.get_by_role("button", name="Receber cultivadores").click()

        self.navigate("heroes")
        expect(self.page.locator(".collection-card")).to_have_count(14)
        self.page.locator('[data-action="filter"][data-filter="rare"]').click()
        expect(self.page.locator(".collection-card")).to_have_count(2)
        expect(self.page.locator(".collection-card.unowned")).to_have_count(2)
        self.page.locator('[data-action="filter"][data-filter="owned"]').click()
        expect(self.page.locator(".collection-card")).to_have_count(2)
        card = self.page.locator('.collection-card[data-id="han-feng"]')
        expect(card.locator(".copy-badge")).to_have_text("×1")
        card.click()
        expect(self.page.get_by_role("dialog").get_by_role("heading", name="Han Feng")).to_be_visible()
        expect(self.page.locator(".hero-detail-stats > span")).to_have_count(4)
        expect(self.page.locator(".hero-detail-stats")).to_contain_text("25")
        self.page.get_by_role("button", name="Selecionar para a defesa").click()
        expect(self.page.locator('.hero-card[data-id="han-feng"]')).to_have_attribute("aria-pressed", "true")
        expect(self.page.locator("#hud-qi")).to_have_text("180")
        self.page.locator('.map-pad[data-action="place"]').first.click()
        expect(self.page.locator(".map-tower")).to_have_count(1)
        expect(self.page.locator(".map-tower")).to_have_attribute("aria-label", "Han Feng, nível 1")
        expect(self.page.locator("#hud-qi")).to_have_text("95")

        self.navigate("recruit")
        self.summon()
        expect(self.page.locator("#crystal-count")).to_have_text("100")
        expect(self.page.locator(".new-badge")).to_have_text("+1 CÓPIA")
        self.assertEqual(self.stored_profile()["copies"]["han-feng"], 2)
        self.page.keyboard.press("Escape")
        self.page.reload(wait_until="networkidle")
        expect(self.page.locator("#crystal-count")).to_have_text("100")
        expect(self.page.locator(".map-tower")).to_have_count(0)
        expect(self.page.locator("#hud-qi")).to_have_text("180")
        self.navigate("heroes")
        self.page.locator('[data-action="filter"][data-filter="owned"]').click()
        expect(self.page.locator(".collection-card")).to_have_count(2)
        expect(self.page.locator('.collection-card[data-id="han-feng"] .copy-badge')).to_have_text("×2")

        self.navigate("recruit")
        self.summon()
        self.page.keyboard.press("Escape")
        expect(self.page.locator("#crystal-count")).to_have_text("0")
        expect(self.page.locator('[data-action="summon"][data-count="1"]')).to_be_disabled()
        expect(self.page.locator('[data-action="summon"][data-count="10"]')).to_be_disabled()
        self.page.reload(wait_until="networkidle")
        expect(self.page.locator("#crystal-count")).to_have_text("0")
        self.assertEqual(self.stored_profile()["totalSummons"], 3)

    def test_mobile_recruitment_and_navigation(self):
        self.page.set_viewport_size({"width": 390, "height": 844})
        self.assert_no_overflow()
        self.navigate("recruit")
        self.assert_no_overflow()
        expect(self.page.locator(".probability-grid > div")).to_have_count(7)
        self.summon()
        expect(self.page.locator("#crystal-count")).to_have_text("200")
        self.page.get_by_role("button", name="Receber cultivadores").click()
        self.navigate("heroes")
        self.page.locator('[data-action="filter"][data-filter="owned"]').click()
        expect(self.page.locator(".collection-card")).to_have_count(2)
        self.assert_no_overflow()
        self.page.locator('.collection-card[data-id="han-feng"]').click()
        expect(self.page.get_by_role("dialog")).to_be_visible()
        self.page.get_by_role("button", name="Selecionar para a defesa").click()
        expect(self.page.locator('.hero-card[data-id="han-feng"]')).to_have_attribute("aria-pressed", "true")
        self.assert_no_overflow()


if __name__ == "__main__":
    unittest.main(verbosity=2)
