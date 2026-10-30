# DipCheck Web

Frontend for **DipCheck**: subscribe to a Bavarian river or lake and get its water temperature by email every morning.

> **Status:** Live at [dipcheck.de](https://dipcheck.de) since October 2026. The backend (Spring Boot) lives in the
> separate `dipcheck-api` repository.

## Pages

| Path                   | Purpose                                                                 |
|------------------------|-------------------------------------------------------------------------|
| `/`                    | Search the measurement stations, show the latest temperature, subscribe |
| `/verify/[token]`      | Confirm a subscription (double opt-in)                                  |
| `/unsubscribe/[token]` | Cancel a subscription                                                   |
| `/impressum`           | Legal notice                                                            |
| `/datenschutz`         | Privacy policy                                                          |

The backend puts the links to `/verify/…` and `/unsubscribe/…` into its emails, so these paths must not change.

Both pages only call the API when the user clicks the button, not when the page loads. Mail clients and security
scanners open links in emails automatically, and some of them even run JavaScript; calling the API on page load would
confirm or cancel subscriptions nobody asked for.

## How it works

- **Static site:** The site is built with `nuxt generate` and served as plain files by Caddy. There is no Node server
  in production.
- **Live data:** Stations and measurements are fetched in the browser (`server: false`) instead of at build time, so
  the page shows current values without a rebuild.
- **Rate limits:** The API allows 60 requests per minute per IP, so the page only loads the measurement of the
  selected station instead of all of them. On `429 Too Many Requests` the error message tells the user how long to
  wait, based on the `Retry-After` header.
- **Error messages:** The API returns English Problem Details meant for developers; the frontend maps status codes to
  its own German messages (`app/utils/api.ts`).

## Tech stack

- Nuxt 4, Vue 3, TypeScript
- Plain CSS, no UI framework
- Caddy on a VPS in production

## Running locally

### Prerequisites

- Node.js 22.22.3+ or 24.15+ (required by Nuxt, see `engines` in its `package.json`)
- The backend running on <http://localhost:8080> (see the `dipcheck-api` README). Start it once with the
  `manual-import` profile to fill the local database with measurement stations:

  ```bash
  ./mvnw spring-boot:run -Dspring-boot.run.profiles=manual-import
  ```

### Start the dev server

```bash
npm install
npm run dev
```

The site runs on <http://localhost:3000>. The backend only allows one origin via CORS, so set
`FRONTEND_BASE_URL=http://localhost:3000` in the backend's `.env`.

### Type checking

```bash
npm run typecheck
```

## Building for production

```bash
NUXT_PUBLIC_API_BASE=https://api.dipcheck.de npm run generate
```

The static files end up in `.output/public/` and can be served by any web server.

The API base URL (`runtimeConfig.public.apiBase`) defaults to `http://localhost:8080`. Because there is no server at
runtime, it is baked into the files at build time: setting the variable after the build has no effect.

## Data source

Datenquelle: Bayerisches Landesamt für Umwelt, [www.lfu.bayern.de](https://www.lfu.bayern.de)
([Gewässerkundlicher Dienst Bayern](https://www.gkd.bayern.de)), licensed under
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

## License

[MIT](LICENSE)
