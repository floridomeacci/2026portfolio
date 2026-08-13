# portfolio2026

The source for [floridomeacci.xyz](https://floridomeacci.xyz), my portfolio as a creative technologist in Amsterdam. The site combines case studies and project work with an interactive workflow-style sandbox.

[![Portfolio preview](assets/preview.png)](https://floridomeacci.xyz)

## What is included

- A landing page for selected work and personal projects
- Case-study views with image, video, and project details
- An interactive canvas built with Vue Flow
- An about page with experience, skills, education, and awards
- A small portfolio assistant backed by a server-side Replicate request
- Responsive layouts and single-page routing

## Tech stack

| Area | Technology |
|---|---|
| Application | Vue 3 and TypeScript |
| Routing | Vue Router |
| Interactive canvas | Vue Flow |
| Styling | Tailwind CSS, PostCSS, and custom CSS |
| Icons | Font Awesome |
| Development and builds | Vite 5 and vue-tsc |
| Assistant endpoint | Vercel Function and Replicate |
| Hosting configuration | Vercel |

## Run locally

You need Node.js 20 or newer and npm.

```bash
git clone https://github.com/floridomeacci/portfolio2026.git
cd portfolio2026
npm ci
npm run dev
```

Open <http://localhost:5173>.

The portfolio itself runs in Vite without credentials. The assistant lives in `api/chat.js` and requires `REPLICATE_API_TOKEN` in the server environment. Keep that value in a local environment file or the hosting provider's secret store, never in browser code or version control.

## Checks

```bash
npm run typecheck
npm run build
npm run preview
```

## Project structure

```text
api/          Server-side assistant endpoint
assets/       README preview media
public/       Static images, fonts, videos, and workflow examples
src/pages/    Route-level portfolio pages
src/components/ Shared interface and canvas components
src/composables/ Reusable Vue behavior
```
