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

This repository is based on our [Remix Docs Template](https://github.com/boomerang-io/remix-docs-template) and points to the [Boomerang Docs](https://github.com/boomerang-io/docs) repository. Read the route structure and configuration on the Remix Docs Template repository for more information.

## Setup

1. Copy the `.env.example` file and duplicate it to `.env`
2. Fill in the required configuration options in the `.env` file
3. Update the configuration files in the `/app/config` directory
4. Run `pnpm install` to install the dependencies

## Development

Run the Vite dev server:

```sh
pnpm run dev
```

## Deployment

First, build your app for production:

```sh
pnpm run build
```

Then run the app in production mode:

```sh
pnpm start
```

Now you'll need to pick a host to deploy it to. We use Vercel.
