FROM node:20-slim
# AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# FROM base as pruned
# RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
# RUN pnpm --filter web deploy pruned

# FROM base as dev
WORKDIR /app
ENV NODE_ENV=development
COPY --from=my-builder /pruned/web .
EXPOSE 5173
CMD ["pnpm", "run", "dev"]