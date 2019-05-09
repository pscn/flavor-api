FROM node:11

WORKDIR /usr/src/flavor-api

# copy entire source tree to the image
COPY . .

# change database hostname from localhost to postgres
RUN sed -e 's,host: localhost,host: mongo,' < .flavorrc.default.yml \
    > .flavorrc.yml

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]
