
---

# Buka — Local Spots & Busyness Guide

An open-source Next.js app that helps users discover nearby spots, view live busyness, and get chat-assisted recommendations.

## Features
- Discover nearby spots with Google Maps clustering and heatmap.
- Distance, rating, categories, and busyness filters.
- Chat assistant with text and voice input.
- Accessible, responsive UI with keyboard-friendly navigation.

## Tech Stack
- Next.js (App Router), TypeScript, Tailwind CSS
- Google Maps via `@react-google-maps/api` and `@googlemaps/markerclusterer`
- Axios for API calls

---

## Getting Started (Project Setup)

1. Clone the repository and install dependencies:
   ```bash
   pnpm install
   # or
   npm install
   ```

2. Create a `.env.local` file at the project root and set the required variables (see next section).

3. Start the dev server:
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

4. Open http://localhost:3000

## Environment Variables
Create `.env.local` with:
```bash
# Frontend API base URL (points to your backend or mock server)
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Google Maps (required for map and clustering)
NEXT_PUBLIC_GOOGLE_MAPS_KEY=YOUR_GOOGLE_MAPS_API_KEY
```

Notes:
- `NEXT_PUBLIC_GOOGLE_MAPS_KEY` is read in `src/components/maps.tsx` via `useJsApiLoader`.
- `NEXT_PUBLIC_API_URL` configures the Axios instance in `src/services/app.service.ts`.

---

## Demo Data & Screenshots
- Demo dataset (JSON): `data/demo/spots.sample.json` (example schema matching the Spot interface). You can import this through your backend seed script or mock the API in dev.
- Screenshots: `docs/screenshots/`
  - `home.png` — home dashboard
  - `map.png` — map with clusters
  - `chat.png` — chat assistant

These paths are suggestions you can follow. If you prefer other locations, update this README accordingly.

---

## Seeding Data (Optional)
If you maintain a backend, add a seed script there and expose either:

- A script in this repo that calls your backend seeder:
  ```bash
  pnpm run seed
  ```

- Or a simple HTTP endpoint in your backend that imports `data/demo/spots.sample.json`.

Document your backend seed strategy here as needed.

---

## Run, Build, and Lint
```bash
# Dev
pnpm dev

# Build
pnpm build

# Start (production)
pnpm start

# Lint
pnpm lint
```

---

## Deployment (Vercel)
1. Push your repository to GitHub.
2. Import into Vercel and set the Environment Variables:
   - `NEXT_PUBLIC_API_URL`
   - `NEXT_PUBLIC_GOOGLE_MAPS_KEY`
3. Deploy. Vercel will build and host your app.

Alternative hosts (Netlify, etc.) work as well — ensure env vars are set.

---

## Contributing
We welcome contributions! Please:
- Read `CONTRIBUTING.md` for setup, branching, commit style, and review process.
- Follow `CODE_OF_CONDUCT.md`.

### Issue & PR Templates
Place the following files (suggested paths):
- `.github/ISSUE_TEMPLATE/bug_report.md`
- `.github/ISSUE_TEMPLATE/feature_request.md`
- `.github/pull_request_template.md`

These help standardize and speed up review.

---

## Code of Conduct
This project follows the Contributor Covenant. See `CODE_OF_CONDUCT.md`.

---

## License
MIT License. See `LICENSE` for details.

