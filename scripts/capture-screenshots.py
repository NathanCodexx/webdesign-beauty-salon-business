"""Capture website screenshots for GitHub README."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import threading
import time

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "screenshots"
PORT = 4173


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)


def start_server():
    server = ThreadingHTTPServer(("127.0.0.1", PORT), Handler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    return server


def capture():
    OUT_DIR.mkdir(exist_ok=True)
    server = start_server()
    base_url = f"http://127.0.0.1:{PORT}"

    shots = [
        ("01-hero-desktop", {"viewport": (1440, 900), "selector": "#home"}),
        ("02-services", {"viewport": (1440, 900), "selector": "#services"}),
        ("03-pricing", {"viewport": (1440, 900), "selector": "#pricing"}),
        ("04-gallery", {"viewport": (1440, 900), "selector": "#gallery"}),
        ("05-booking", {"viewport": (1440, 900), "selector": "#booking"}),
        ("06-contact", {"viewport": (1440, 900), "selector": "#contact"}),
        ("07-full-page-desktop", {"viewport": (1440, 900), "full_page": True}),
        ("08-mobile-hero", {"viewport": (390, 844), "selector": "#home", "mobile": True}),
        ("09-mobile-full-page", {"viewport": (390, 844), "full_page": True, "mobile": True}),
    ]

    with sync_playwright() as p:
        browser = p.chromium.launch()

        for name, opts in shots:
            width, height = opts["viewport"]
            context = browser.new_context(
                viewport={"width": width, "height": height},
                device_scale_factor=2,
                is_mobile=opts.get("mobile", False),
            )
            page = context.new_page()
            page.goto(base_url, wait_until="networkidle")
            page.wait_for_timeout(1000)

            path = OUT_DIR / f"{name}.png"

            if opts.get("full_page"):
                page.screenshot(path=str(path), full_page=True)
            else:
                locator = page.locator(opts["selector"])
                locator.scroll_into_view_if_needed()
                page.wait_for_timeout(500)
                locator.screenshot(path=str(path))

            print(f"Saved {name}.png")
            context.close()

        browser.close()

    server.shutdown()
    print(f"\nScreenshots saved to {OUT_DIR}")


if __name__ == "__main__":
    capture()
