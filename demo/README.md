# EduTrace-ES UI demo

This is a separate Next.js frontend for demonstrating the EduTrace-ES screens. It does not connect to MongoDB or the full application's API, and it does not persist user changes.

## Run

```powershell
npm ci
$env:PORT = "3001"
npm run dev
```

Open `http://localhost:3001`. Requires Node.js/npm compatible with Next.js 16.

## Demo behavior

- Dashboard values, analytics, and notifications are mock data.
- Sensor values are generated in the browser and refreshed every 30 seconds.
- Recommendations are static examples; the re-analyze button simulates an update.
- Document screens use demo fixtures and simplified rule-based behavior, not OCR or verified AI analysis.
- Login, settings, and contact interactions are presentation-only; there is no account service or persistence.

The demo is not evidence of real sensor, accreditation, analytics, or AI results. The production-oriented `edutrace-web` folder is also a prototype; see its README and the repository-root technical audit for limitations and security gaps.
