# Secure Login Route

Files added:

- `backend/models/User.js`
- `backend/auth/secureLoginRoute.js`
- `backend/server.js`

Install dependencies:

```bash
npm install
```

Required environment variables:

```bash
MONGODB_URI=mongodb+srv://...
JWT_SECRET=replace-with-a-long-random-secret
NODE_ENV=production
```

Run locally:

```bash
node backend/server.js
```

Login endpoint:

```txt
POST /portal/login
Content-Type: application/json

{
  "username": "user@example.com",
  "password": "secret-password"
}
```

All invalid login attempts return the exact same response:

```json
{ "message": "Invalid username or password" }
```

The route intentionally performs a dummy bcrypt comparison when the username is not found, reducing timing differences between nonexistent users and wrong passwords.