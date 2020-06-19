########################
# base layer
########################
FROM node:12-alpine AS base
# Create app directory
WORKDIR /usr/src/app
# copy package.json and yarn.lock
COPY package.json yarn.lock ./

########################
# dependency layer
########################
FROM base AS dependencies
# install yarn as a global and adhere to the lockfile
# install only prod dependencies
# RUN npm install --global yarn && yarn install --frozen-lockfile --production=true
RUN yarn install --frozen-lockfile --production=true
# copy the prod dependecies for use in final image
RUN cp -R node_modules prod_node_modules
# install the rest of the dependencies for testing
RUN yarn install --frozen-lockfile

########################
# test layer
# basic sanity to make sure we have a working system
# note: we will use base/dependencies layers in the release
# skipping the test layer in the release
########################
FROM dependencies AS test
# copy all the things
COPY . .
# test
# testing is expected to handle code coverage checks
RUN yarn run lint && yarn run test

########################
# release layer
# note: this layer does not have yarn as we use the 
# base layer (pre-dependencies layer) and ONLY copy
# the prod_node_modules from the dependencies layer
########################
FROM base AS release
# copy just the production node_modules
COPY --from=dependencies /usr/src/app/prod_node_modules ./node_modules
# copy the rest of the source
COPY . .
# expose the port nodejs is running on
EXPOSE 8080
# execute node
CMD [ "node", "src/index.js" ]