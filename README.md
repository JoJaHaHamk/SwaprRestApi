# SwaprRestApi
This repository contains the source code for the RESTapi for the Swapr application. The api is written in Typescript with express (web framework) and typeorm (object relation mapper). The api is hosted in google cloud engine. The database connected to the api is a mysql database, also hosted in google cloud.

## Endpoints
All endpoints of the RESTapi can be found in the apispec file. This file is located in the spec folder.

## Summary
- I create another GET endpoint for the user
- When a book is added, the 10 closes swaps will be calculated (filtered by city)
- When the swipelist for the user is created, the first swaps that will appear are swaps accepted by the other user. After that, all the other swaps will be shown.

## ToDo
- Add filter by type to get books
- Authorization fix (check if user is actual user)
- change add books to use author and title from api request from application
  {
    "isbn": "978-3-16-148410-0",
    "title": "title",
    "author": "author",
    "type": "owned"
}
- change get swaps to query parameter
- update the get swaps to the api spec where the book of the loged in user is always the owned book
- get endpoint for swaps different with accepted