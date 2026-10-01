# EDU TMT Steel

React website and blog management tools for EDU TMT Steel Limited. The project
uses TanStack Start for routing and server rendering, Supabase for data and
authentication, GitHub Actions for code checks and controlled migrations, and
Vercel for web hosting.

Start here:

1. Follow [SETUP.md](SETUP.md) to configure Supabase and run the app locally.
2. Read [docs/README.md](docs/README.md) for the application architecture and
   database details.
3. Read [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) to connect GitHub, Vercel, and
   Supabase.

```sh
npm ci
npm run dev
```

The local server runs at <http://localhost:8080>. Do not commit `.env` files,
database passwords, access tokens, or Supabase service-role keys.
