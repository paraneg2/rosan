# ROSA NERA — Telegram Mini App

A lightweight, mobile-first product catalogue for Telegram Web / Telegram Mini Apps.

## Features

- Dark, minimal and elegant English interface.
- Two products per horizontal row in Grid view.
- Horizontal product carousel.
- Full-screen vertical product viewer with swipe-up / swipe-down navigation.
- Product video, photo strip, description, euro price and weight in grams.
- Telegram and Signal contact links.
- Product data managed in `data/products.json`.
- Telegram Mini App SDK integration (`ready`, `expand`, BackButton).

## Project structure

```text
rosa-nera-mini-app/
├── index.html
├── css/style.css
├── js/app.js
├── data/products.json
└── README.md
```

## Add products

Edit `data/products.json`. The starter file is intentionally empty, so no fake products or broken demo media appear on first launch. Add product objects to the array. Each product supports:

- `id`: unique identifier.
- `name`: product name.
- `description`: short description.
- `price`: numeric price in EUR.
- `grams`: product weight in grams.
- `video`: public MP4 URL (H.264 video, AAC audio recommended).
- `poster`: optional video poster image.
- `image`: optional catalogue fallback image.
- `images`: optional array of additional product photos.

Keep the list at 20 products or fewer. Replace all `YOUR-R2-PUBLIC-DOMAIN` examples with your real public R2 custom domain.

## Local preview

Because the app loads JSON using `fetch`, serve the folder with a local web server rather than opening `index.html` as a file. For example:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Deploy to GitHub + Cloudflare Pages

1. Create a GitHub repository and upload the contents of this folder.
2. In Cloudflare, open **Workers & Pages → Create → Pages → Connect to Git**.
3. Select the repository.
4. For a plain HTML project, leave the build command empty and set the output directory to `/` (the repository root).
5. Deploy. Cloudflare Pages will provide a `pages.dev` URL.

## Connect the Telegram Mini App

The bot username is `@rosanerapack_bot`. In Telegram, open **@BotFather** and configure the Mini App / Web App URL to the deployed HTTPS Cloudflare Pages URL. The exact BotFather menu can vary; use the Web App / Mini App configuration for your bot. Do not put the bot token in this repository or in frontend JavaScript.

## Cloudflare R2

1. Create an R2 bucket for product media.
2. Enable a public custom domain for the bucket (recommended for production).
3. Upload MP4 videos and JPG/WebP photos.
4. Paste the public media URLs into `data/products.json`.

Use mobile-friendly MP4 files (H.264 + AAC), portrait 1080 × 1920, and keep each clip under 20 seconds. R2 serves the files; it does not automatically transcode videos into adaptive streams.

## Autoplay audio note

Mobile browsers and Telegram's embedded browser commonly block autoplay with sound until the user interacts with the page. The app therefore starts videos muted and includes a **SOUND ON / SOUND OFF** control. After the user taps SOUND ON, the active video is played with audio where the client permits it.

## Contact destinations

- Telegram: `https://t.me/rosanerapack`
- Signal: configured Signal share link in `js/app.js`

## Before launch

- Replace the example product entry and all media URLs.
- Test the deployed URL inside Telegram on iOS and Android.
- Confirm that the R2 bucket's public domain and CORS settings allow media playback.
- Configure the Mini App URL with BotFather.
