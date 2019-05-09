# flavor-api

Instead of postgres this uses MongoDB.

# quick'n'dirty

Start fresh:

```sh
yes | docker-compose rm && docker-compose up  --build
```

Connect to [http://localhost:3000](http://localhost:3000) and test endpoints [vendor](http://localhost:3000/vendor) and [flavor](http://localhost:3000/flavor).  Vendor should be full CRUD, flavor only CR.