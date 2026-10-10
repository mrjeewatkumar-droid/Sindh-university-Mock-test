# Sindh University Entry Test — 100 MCQs Mock Practice Paper

A ready-to-share, self-hosted online test. Static site (HTML/CSS/JS) — no server or database needed. Works on GitHub Pages.

**Shareable link format (after publishing):** `https://<your-username>.github.io/sindh-university-mock-test/`

## Features (matches the test instructions)

- **Name section** — candidate enters full name + email before starting
- **One email, one attempt** — a valid email format is required; each email can be used only once (enforced per browser)
- **100 MCQs, single correct option** — radio buttons, only one selectable per question
  - English: 30 (Q1–30) · General Knowledge: 20 (Q31–50) · Mathematics: 20 (Q51–70) · IQ: 10 (Q71–80) · Everyday Science & Computer: 20 (Q81–100)
- **Tab-switching restricted** — leaving the tab counts as a violation; **3 violations auto-submit** the test
- **90-minute timer** — auto-submits when time runs out; survives page refresh (timer + answers are restored)
- **100 marks, no negative marking**
- **Result shown to the candidate** immediately after submission: total score, percentage, section-wise breakdown, and full answer review
- **History saved for the publisher** — every attempt is stored; open *"Publisher: view test history"* on the start page (default code: `sindh2026`) to see all attempts, download them as CSV, or clear history

## Publish to GitHub (about 3 minutes)

1. Create a new **public** repository on GitHub named `sindh-university-mock-test` (do not add a README/license — keep it empty).
2. From this folder, run:
   ```bash
   git remote add origin https://github.com/<your-username>/sindh-university-mock-test.git
   git branch -M main
   git push -u origin main
   ```
3. On GitHub, go to **Settings → Pages** → under *Build and deployment*, set **Source** to **Deploy from a branch**, choose **main** and **/(root)**, then **Save**.
4. After ~1 minute your test link is live:
   `https://<your-username>.github.io/sindh-university-mock-test/`

Share that link with candidates.

## Before sharing — change these in `data.js`

- `CONFIG.ADMIN_CODE` — the publisher code that unlocks the test-history view (default `sindh2026`)
- `CONFIG.TIME_LIMIT_MINUTES` — currently `90`
- `CONFIG.MAX_TAB_VIOLATIONS` — currently `3`

## Known limitations (be aware)

- The **one-email-once** rule is enforced per browser (localStorage). A candidate using a different device/browser could re-attempt; the stored history (name, email, score, timestamp) lets you spot duplicates.
- This is a **mock practice test** — it is not a locked-down exam environment. Determined users can bypass client-side restrictions. For high-stakes testing, use a proctored platform.
- Test history lives in the **publisher's browser** (the device where you open the history view won't see attempts made on candidates' own devices). Ask candidates to download their result CSV, or collect results centrally, if you need a single master record.
