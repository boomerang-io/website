# Boomerang Website

The public website and documentation for Boomerang.

## Contributing

If you want to make a contribution

- Fork and clone this repo
- Create a branch
- Push any changes you make to your branch
- Open up a PR in this Repo

For further details and to contribute to the broader project, head on over to our [community](https://github.com/boomerang-io/community) repository and follow the instructions there.

## Design

This repository is based on our [Remix Docs Template](https://github.com/boomerang-io/remix-docs-template), now on React Router 7, and points to the [Boomerang Docs](https://github.com/boomerang-io/docs) repository. Each product in that repository (Flow, Bosun) is a folder with its own release tags (`flow@4.0.0`, `bosun@1.0.0`) and is served at `/docs/<product>/<version>/...`, configured in `app/config/doc.ts`.

## Setup

1. Copy the `.env.example` file and duplicate it to `.env`
2. Fill in the required configuration options in the `.env` file
3. Update the configuration files in the `/app/config` directory
4. Run `pnpm install` to install the dependencies (Node 22.12 or later; `.nvmrc` pins 24)

## Development

Run the Vite dev server:

```sh
pnpm run dev
```

Run the tests, typecheck and lint:

```sh
pnpm test
pnpm typecheck
pnpm lint
```

## Deployment

Build and run the container image (Chainguard Node runtime, non-root, listening on port 3000, probe at `/health`):

```sh
docker build -t boomerang-website .
docker run -p 3000:3000 -e SOURCE_REPO=boomerang-io/docs -e GITHUB_TOKEN=<token> boomerang-website
```

Or build and run the app directly:

```sh
pnpm run build
pnpm start
```

The site is hosted on [Railway](https://railway.com), which builds the `Dockerfile`.
