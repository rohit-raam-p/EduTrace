# EduTrace-ES

EduTrace-ES is a prototype academic-accreditation readiness dashboard. The repository contains two independent Next.js applications:

- **`edutrace-web/`** — the MongoDB-backed prototype, with account, document, sensor, notification, scoring, and recommendation routes.
- **`demo/`** — a UI demo that uses local mock and randomly generated data without a backend.

The project is incomplete and is published as-is to preserve the prototype. See [EDUTRACE_TECHNICAL_DOCUMENTATION.md](./EDUTRACE_TECHNICAL_DOCUMENTATION.md) for a source-based technical audit.

## Requirements

- Node.js and npm compatible with Next.js 16 (the project does not pin a Node.js version).
- MongoDB for `edutrace-web`.
- An OpenAI API key is optional; it enables selected LLM paths in `edutrace-web`.

## Run the MongoDB-backed prototype

```powershell
Set-Location edutrace-web
npm ci
Copy-Item .env.example .env.local
```

Edit `edutrace-web/.env.local` with a MongoDB URI for a database you control and a new, private JWT signing secret. Set `OPENAI_API_KEY` only if you intend to use the optional OpenAI paths. Then start MongoDB and run:

```powershell
npm run dev
```

The app uses the default Next.js development port, `http://localhost:3000`. Registration and login use MongoDB, bcrypt password hashes, and a JWT cookie. The dashboard attempts to seed synthetic sample records after login.

## Run the UI demo

```powershell
Set-Location demo
npm ci
$env:PORT = "3001"
npm run dev
```

Open `http://localhost:3001`. This app does not require MongoDB or an API key; its displayed metrics, sensor readings, analytics, notifications, and recommendations are mock/demo data and are not persisted.

## Implemented and incomplete features

- The full app stores user, institution, document metadata, sensor readings, recommendations, and notifications in MongoDB through Mongoose.
- A weighted readiness score and simple text heuristics exist; the score is not a validated accreditation prediction.
- Some document-analysis and recommendation routes can call OpenAI. File upload currently saves the file but does not extract its text, so uploaded-file analysis is incomplete.
- Sensor readings can be submitted through an HTTP JSON endpoint, and the UI polls the sensor API. The repository does not include sensor firmware, MQTT, WebSockets, or a verified hardware connection.
- Analytics charts include formula-generated values; the demo app uses mock values.
- OCR, RAG/vector search, predictive machine learning, SSO, password reset, and role-based authorization are not implemented.

## Publication and security notice

This is a prototype, not a production-ready service. The current source has API authorization gaps, including mock-user routes and an unauthenticated sensor-ingest route. Uploaded files are written under the app's public directory. Do not deploy this app publicly, connect real institutional data, or upload private documents without first addressing the issues described in the technical audit.

Keep `.env.local` private. `.env.example` contains placeholders only. Local database diagnostics and generated debug files are excluded from Git.
