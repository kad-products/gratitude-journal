FROM ghcr.io/pnpm/pnpm:12
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN --mount=type=secret,id=NODE_AUTH_TOKEN \
    test -s /run/secrets/NODE_AUTH_TOKEN || { echo "ERROR: NODE_AUTH_TOKEN secret is empty or missing"; exit 1; } && \
    pnpm config set //npm.pkg.github.com/:_authToken "$(cat /run/secrets/NODE_AUTH_TOKEN)" && \
    pnpm install --frozen-lockfile && \
    pnpm config delete //npm.pkg.github.com/:_authToken
COPY . .
RUN pnpm build
CMD ["pnpm", "dev"]