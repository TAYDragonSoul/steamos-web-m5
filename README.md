# Steam Remote — iPad PWA starter

This is the first client-side milestone: an installable, Steam-inspired iPad web app shell for a **local** Steam Headless server.

## What works now
- Responsive Steam-inspired dashboard.
- Server URL setting saved locally in the browser.
- Connect button hands off to the Steam Headless browser portal.
- PWA manifest and service worker for Add to Home Screen.
- Home, Library, Controls, and Settings navigation placeholders.

## What is not integrated yet
- Automatic Steam library/game metadata.
- Launching a selected game from this custom dashboard.
- Embedded in-page WebRTC streaming.
- Touch controls mapped to a virtual gamepad.
- Multi-user accounts.

The Connect button intentionally opens the real Steam Headless portal. The starter does not fake a working stream or assume that the server's portal can be embedded cross-origin.

## Server foundation
Steam Headless currently documents a Linux host + Docker setup, a Fedora-based gaming container, hardware GPU encoding, and a browser portal at HTTPS port `8483`. It is not Valve's SteamOS distribution. See:
- https://steamheadless.com/docs/
- https://steamheadless.com/docs/installation/
- https://steamheadless.com/docs/shui/first-run/

For the first test:
1. Set up Steam Headless on a separate Linux PC/server with a supported GPU.
2. Keep the iPad and server on the same Wi-Fi.
3. Open the Steam Headless portal directly on the iPad and complete its first-run setup.
4. Host this PWA over HTTPS (or localhost during development).
5. Open this PWA on the iPad, choose Settings, and save `https://SERVER-LAN-IP:8483`.
6. Tap Connect.

## Run locally for development
From this directory, run any static web server, for example:
```bash
python3 -m http.server 8080
```
Open `http://localhost:8080` on the development computer. For iPad installation, deploy behind HTTPS on your LAN. Browsers require a secure context for service workers and many media APIs.

## iPad installation
1. Open the hosted HTTPS address in Safari.
2. Tap Share → Add to Home Screen.
3. Enable Open as Web App if shown.
4. Launch Steam Remote from the Home Screen.

## Important iPad notes
- The iPad is the streaming client; the server does the game rendering and encoding.
- Bluetooth controller pairing is done in iPadOS Settings → Bluetooth.
- Safari's gamepad behavior and touch-to-controller forwarding must be validated with the selected streaming client and game.
- A stable 5 GHz or 6 GHz Wi-Fi connection is recommended for local streaming.
