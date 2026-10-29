# EduTrace-ES full prototype

This Next.js application contains the MongoDB-backed EduTrace-ES prototype. It is not a production-ready accreditation platform.

## Setup

Requirements: Node.js/npm compatible with Next.js 16 and a MongoDB instance. An OpenAI API key is optional.

```powershell
npm ci
Copy-Item .env.example .env.local
```

Set `MONGODB_URI` to a database you control and replace `JWT_SECRET` with a new private random value in `.env.local`. Set `OPENAI_API_KEY` only if you want to enable the optional LLM routes. Do not commit `.env.local` or share its contents.

Start MongoDB, then run:

```powershell
npm run dev
```

The development server uses the default Next.js port, `http://localhost:3000`.

## Current implementation

- Account registration/login stores users in MongoDB, hashes passwords with bcrypt, and uses a JWT cookie.
- Mongoose models and API routes cover institutions, documents, sensors, recommendations, and notifications.
- Document upload stores the file and metadata. Text extraction/OCR is not implemented, so uploaded file contents are not currently analyzed.
- Optional OpenAI Chat Completions calls exist for some analysis/recommendation paths. Static fixtures and rule-based scoring are also used.
- Sensor APIs accept/persist some JSON readings; dashboard polling and seed data are implemented. The repository does not include firmware, MQTT, WebSockets, or a verified hardware integration.
- Analytics include formula-generated department and trend data; they are not historical measurements.

OCR, RAG/vector search, predictive machine learning, SSO, password reset, and role-based authorization are not implemented.

## Security

This application is a prototype. Current source includes authentication gaps on some APIs, an unauthenticated sensor-ingest endpoint, and uploaded files stored under `public/uploads`. Do not deploy it publicly or upload private institutional data without addressing these issues. See the repository-root `EDUTRACE_TECHNICAL_DOCUMENTATION.md` for the audit.

## UI-only demo

The separate `../demo` application uses mock/random data and has no backend requirement. From that directory, set `PORT=3001` in your shell and run `npm ci` followed by `npm run dev`.
