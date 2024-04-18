ARG HOSTNAME
ARG PORT

FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app
COPY package*.json pnpm-lock.yaml ./

FROM base as dev
ENV NODE_ENV=developmet HOSTNAME=${HOSTNAME} PORT=${PORT}
RUN pnpm install
COPY . .
RUN pnpm run build
EXPOSE ${PORT}
CMD ["pnpm", "run", "start"]

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
COPY . .
RUN pnpm run build

FROM base as prod
ENV NODE_ENV=production HOSTNAME=${HOSTNAME} PORT=${PORT}
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist
EXPOSE ${PORT}
CMD [ "pnpm", "run", "start" ]
