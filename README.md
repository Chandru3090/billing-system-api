# Billing System API - Auth

This small API demonstrates user register/login/profile endpoints with JWT authentication and MongoDB Atlas integration.

## Environment
Copy `.env.example` to `.env` and update `MONGODB_URI` and `ACCESS_TOKEN_SECRET`.

## Dev
Install dependencies and run with ts-node and nodemon:

```powershell
npm install
npm run dev
```

## Endpoints
- POST /api/auth/register - { name, email, password }
- POST /api/auth/login - { email, password }
- GET /api/auth/profile - Authorization: Bearer <token>
 - POST /api/v1/auth/register - { name, email, phone, password }
 - POST /api/v1/auth/login - { email, password }
 - POST /api/v1/auth/logout - clears cookie
 - GET /api/v1/auth/user - Authorization: cookie `access_token` is used for authentication

### Sample curl requests

Register:
```
curl -X POST http://localhost:5000/api/auth/register \
	-H "Content-Type: application/json" \
	-d '{"name":"John Doe","email":"john@example.com","password":"secret"}'
```

Login:
```
curl -X POST http://localhost:5000/api/auth/login \
	-H "Content-Type: application/json" \
	-d '{"email":"john@example.com","password":"secret"}'
```

Get profile:
```
curl -X GET http://localhost:5000/api/auth/profile \
	-H "Authorization: Bearer <TOKEN_FROM_LOGIN>"
```

## Generating a secure ACCESS_TOKEN_SECRET 🔐

Use a secure random value at least 256 bits (32 bytes) long. Below are a few simple ways to generate one locally.

- Node one-liner (PowerShell or any shell):
```
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

- Node one-liner (base64):
```
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

- OpenSSL (if installed):
```
openssl rand -hex 32
```

- Use the helper script we added to this repo:
```
node scripts/generate-secret.js
# specify bytes and base64 if you want e.g. 64 bytes as base64
node scripts/generate-secret.js 64 --base64
# update .env with the generated secret (be careful, this will modify .env)
node scripts/generate-secret.js --update-env
```

Best practices:
- Do NOT commit secrets to source control. Add `.env` to `.gitignore`.
- Use a secret manager in production (AWS Secrets Manager, Azure Key Vault, GCP Secret Manager) if possible.
- Rotate your secret when needed. Rotating the secret will invalidate all existing tokens; if you need to avoid invalidation, implement a token-versioning mechanism in your user model.
- Keep the secret length at least 32 bytes (256 bits) for HMAC-based JWT signing such as HS256.

## Troubleshooting MongoDB connection issues

If you see an error such as `ECONNREFUSED ::1:27017` or `ECONNREFUSED 127.0.0.1:27017`, the app is trying to connect to a local MongoDB instance (localhost) rather than your MongoDB Atlas cluster. Common causes and fixes:

- Check that your `.env` file is in the project root and not in `src/`.
	- The server loads environment variables from `.env` at the project root by default. If your `.env` is in `src/`, either move it to project root or set it properly.
- Ensure `MONGODB_URI` in `.env` is present and valid (looks like `mongodb+srv://<user>:<pw>@cluster?.mongodb.net/<dbname>?retryWrites=true&w=majority`).
- Confirm the server process is started from the project root (i.e., `npm run dev` executed from the repo root). Otherwise `dotenv` may not find the `.env` in the right location.
- Check that the MongoDB Atlas cluster allows connections from your IP address:
	- In Atlas Network Access, add your client IP or use `0.0.0.0/0` for testing (not recommended in production).
- Test connection manually with the script added to `scripts/test-connection.js`:
	- `node scripts/test-connection.js` (this reads the same MONGODB_URI from config and attempts to connect)
- If you still see localhost being used, add a console log to `src/config/config.ts` or check logging in `src/config/database.ts` for the `databaseURI` value to ensure the env var was loaded correctly (we added logging already).
- If your app is running in Docker or a remote environment, make sure the environment variables are passed to the container or set in your platform (e.g., Azure App Service, Heroku, etc.).

ALSO: Note `ALLOW_LOCAL_DB` environment variable. If `ALLOW_LOCAL_DB` is set to `true` (default for development), the app will fallback to using `mongodb://localhost:27017/pos` when `MONGODB_URI` is not set — this is convenient for local development, but if you accidentally deploy without setting `MONGODB_URI`, you may encounter connection attempts to `localhost` which can result in `ECONNREFUSED` errors. Set `ALLOW_LOCAL_DB=false` in production to avoid this fallback.

If you want me to make the env-loading behavior stricter and fail loudly when MONGODB_URI is not set, I can do that.

### Debug help: verify environment at runtime
If `MONGODB_URI` and `ACCESS_TOKEN_SECRET` don't appear to be populated, use the helper scripts to debug where the process is picking up env vars and whether connection works:

```
npm run print-env
# or
node scripts/print-env.js
```

```
node scripts/test-connection.js
```

If `npm run print-env` shows `MONGODB_URI` as `undefined`, ensure `.env` is in the project root, or place it in `src/.env` if you prefer. When running `nodemon` or `ts-node`, confirm you started them from the repo root.

### Quick setup script
If you prefer, copy `.env` from `src/.env` to the project root automatically:

```
npm run setup-env
```

This will *only* copy the `src/.env` file if a root `.env` is missing.

Windows PowerShell tip (temporarily set env in current session and start server):
```
$env:MONGODB_URI = 'mongodb+srv://user:pass@cluster/name?retryWrites=true&w=majority'
$env:ACCESS_TOKEN_SECRET = 'YOUR_SECRET'
npm run dev
```


