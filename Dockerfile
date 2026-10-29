# syntax=docker/dockerfile:1
# Three stages, the same shape as Flow's client-web image: a build stage, a stage that installs
# the serving packages, and a runtime stage on Chainguard's minimal Node image.
# `docker build .` produces a working image from a clean checkout; nothing runs `pnpm run build`
# on the host first.
#
# The first two stages run on the builder's own platform: build/ is JavaScript and CSS and the
# serving packages are pure JavaScript, the same for every target. Only the runtime stage is per
# platform.
#
# Chainguard's free tier publishes `:latest` only (Node 26 today), with no versioned tag or digest
# that stays pullable, so the floating tag is the intended usage; rebuild to pick up fixes.

# ---------------------------------------------------------------------------------------------
# Build stage: pnpm install + react-router build. Nothing from here ships except build/.
# ---------------------------------------------------------------------------------------------
FROM --platform=$BUILDPLATFORM cgr.dev/chainguard/node:latest-dev AS build
USER root
WORKDIR /src

# pnpm at the version package.json's `packageManager` pins, so the image, CI and a developer's
# shell resolve the lockfile with the same pnpm. /usr/local/bin is ahead of the image's own pnpm
# on PATH.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN npm install -g --prefix /usr/local \
      "pnpm@$(node -p "require('./package.json').packageManager.split('@')[1]")"

# Dependencies are installed from just the manifest, lockfile and pnpm-workspace.yaml (its
# allowBuilds list) first, so a source-only change doesn't reinstall.
RUN pnpm install --frozen-lockfile

# The remaining context (see .dockerignore). Emits build/client (browser assets) + build/server
# (the request handler). The server bundle is self-contained (vite.config.ts: ssr.noExternal), so
# the runtime needs none of these packages.
COPY . .
RUN pnpm run build

# ---------------------------------------------------------------------------------------------
# Serving packages: package.json's `dependencies` are exactly what the running server loads -
# @react-router/serve and react-router. Everything Vite bundles is under `devDependencies`.
# ---------------------------------------------------------------------------------------------
FROM --platform=$BUILDPLATFORM build AS serve-deps
RUN rm -rf node_modules \
    && pnpm install --prod --frozen-lockfile --ignore-scripts

# ---------------------------------------------------------------------------------------------
# Runtime stage: react-router-serve over build/, nothing else.
# ---------------------------------------------------------------------------------------------
FROM cgr.dev/chainguard/node:latest
ENV NODE_ENV=production
ENV BMRG_HOME=/opt/boomerang
WORKDIR $BMRG_HOME

COPY --from=serve-deps /src/package.json ./package.json
COPY --from=serve-deps /src/node_modules ./node_modules
COPY --from=build /src/build ./build

# The server runs on node alone, so the image's npm and node-gyp, which carry their own
# dependency trees, are removed. The files stay root-owned and world-readable: the server writes
# nothing to disk.
USER root
RUN rm -rf /usr/lib/node_modules /usr/bin/npm /usr/bin/npx /usr/bin/node-gyp

# Non-root. 2000 matches the numeric user the Flow images run as; OpenShift requires a numeric
# USER rather than a name.
USER 2000

# react-router-serve reads PORT (and HOST) from the environment. The server needs SOURCE_REPO and,
# with NODE_ENV=production, GITHUB_TOKEN (app/utils/env.server.ts). The probe is GET /health
# (app/routes/health.ts). dumb-init runs as PID 1 so SIGTERM reaches node.
EXPOSE 3000
ENTRYPOINT ["/usr/bin/dumb-init", "--", "/usr/bin/node", "node_modules/@react-router/serve/dist/cli.js", "build/server/index.js"]
