# Overthinking as a Service

A self-contained React prototype where five friend personas overthink everyday situations with you. The response API is deterministic and local, so the app works without GitHub, external services, or API keys.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Deploy to Vercel

1. Import this project into Vercel or run `vercel` from the project directory.
2. Use `npm run build` as the build command.
3. Use `dist` as the output directory.
4. Add no environment variables. The included `.env.example` is informational only.

Vercel serves the Vite app from `dist` and the serverless endpoints from `api/`. The available endpoints are `GET /api/health` and `POST /api/chat`.

## Scripts

- `npm run dev` starts the local Express/Vite development server.
- `npm run build` creates the production Vite bundle.
- `npm run lint` runs the TypeScript check.
