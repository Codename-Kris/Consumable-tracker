# Consumable Tracker

A working starter version of the Consumable Tracker app from the PRD — built as a single-page app (React + Vite). No backend or database setup needed: it runs entirely in the browser and saves its data in the browser's local storage, so you can try the whole workflow immediately.

## What's included (MVP)

- **Dashboard** — low stock alerts, pending requests, recent activity, requests by department
- **Inventory Management** — add, edit, remove consumables, set minimum stock levels
- **Stock Receipts** — record incoming deliveries from suppliers
- **My Requests** — submit and track consumable requests
- **Approval Workflow** — approve or reject pending requests with comments
- **Inventory Issuance** — hand out approved items and log who received what
- **Reports** — inventory balances, consumption, department usage, reorder list, with CSV export
- **Audit Trail** — a log of every action taken in the system
- **Role switching** — use the dropdown in the top right to view the app as a Super Administrator, Inventory Administrator, Department Manager, or Employee, and see how access changes

There's no login system yet — the role switcher is a stand-in for real authentication, so you can demo every workflow without setting up accounts.

## How to put this on Vercel (no coding experience needed)

You have two easy options. **Option A is the simplest if you've never used GitHub or a terminal.**

### Option A — Drag and drop with the Vercel CLI (fastest)

1. Install [Node.js](https://nodejs.org) if you don't already have it (just click the big green "LTS" download button and run the installer).
2. Open a terminal (on Mac: Terminal app, on Windows: Command Prompt) and go to this folder, e.g.:
   ```
   cd path/to/consumable-tracker
   ```
3. Install the project's dependencies:
   ```
   npm install
   ```
4. Install Vercel's command line tool (one-time):
   ```
   npm install -g vercel
   ```
5. Deploy:
   ```
   vercel
   ```
   It will ask a few questions — pressing Enter to accept the defaults is fine. When it's done, it gives you a live URL.
6. For future updates, run `vercel --prod` to push changes live.

### Option B — Connect a GitHub repo (best if you'll keep editing it)

1. Create a free account on [github.com](https://github.com) if you don't have one.
2. Create a new repository and upload this entire folder to it (GitHub's website lets you drag and drop files if you don't want to use git commands).
3. Go to [vercel.com](https://vercel.com), sign up/log in, click **Add New → Project**, and import that GitHub repository.
4. Vercel will detect it's a Vite app automatically. Leave the settings as they are and click **Deploy**.
5. Every time you push a change to GitHub, Vercel redeploys automatically.

## Running it on your own computer first (optional but recommended)

```
npm install
npm run dev
```
Then open the link it prints (usually `http://localhost:5173`) in your browser.

## A note on the data

This version stores everything in your browser (localStorage) so it works without any setup. That means:
- Data is per-browser, not shared between users in real life.
- Clearing your browser data will reset the app back to its starter inventory.
- This is intentional for a demo/MVP. The next step for a real rollout would be connecting it to a shared database and adding real logins — happy to help with that whenever you're ready.

## Project structure

```
src/
  data/store.js        – starter data + save/load logic (swap this for real APIs later)
  components/          – one file per page/section
  App.jsx              – page routing, permissions, and all the business logic
  index.css            – all styling (navy/teal/gold theme)
```
