# SwaprRestApi
This repository contains the source code for the RESTapi for the Swapr application. The api is written in Typescript with express (web framework) and typeorm (object relation mapper). The api is hosted in google cloud engine. The database connected to the api is a mysql database, also hosted in google cloud.

## Endpoints
All endpoints of the RESTapi can be found in the apispec file. This file is located in the spec folder.

## ToDo
- Add filter by type to get books

- change get swaps to query parameter
- update the get swaps to the api spec where the book of the loged in user is always the owned book
- get endpoint for swaps different with accepted
