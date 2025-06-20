# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lock /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile --production

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS prerelease
ENV NODE_ENV=production
RUN mkdir -p /temp/prod
COPY package.json bun.lock /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile
# --production
COPY . /temp/prod
RUN cd /temp/prod && bun run check
RUN cd /temp/prod && bun run build

FROM base AS release
COPY --from=install /temp/dev/node_modules node_modules
COPY --from=prerelease /temp/prod/package.json package.json
COPY --from=prerelease /temp/prod/dist dist

USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "start" ]
