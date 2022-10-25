## Project structure

`./app.ts` 
- Main entry file

The idea behind the 2 folders i.e **common** and **users** is to have individual modules
that have their own responsibilities.
For each module, there're the following:

- Route configuration to define the request for our API 
- Services for tasks such as connection to the db models, doing queries or connecting 
to external services that are required by the specific request.
- Middleware for running specific request validations before the final controller of
a route handles its specifics
- Models for defining data models matching a given db schema, to facilate data storage
& retrieval.
- Controllers for seperating the route configuration from the code that finally, - after
all middleware, processes a route request, calls the abouve service functions if 
necessary, and gives a response the the client.
