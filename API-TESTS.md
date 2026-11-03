# EchoAPI testing guide (Part B)

Base URL: `http://localhost:4000`

For POST and PUT requests, select **Body -> raw -> JSON** and set `Content-Type: application/json`.

## 1. GET all books

- Method: `GET`
- URL: `http://localhost:4000/books`
- Expected: HTTP `200` and the three sample books.

## 2. GET one book

- Method: `GET`
- URL: `http://localhost:4000/books/1`
- Expected: HTTP `200` and the book whose ID is `1`.

## 3. POST a new book

- Method: `POST`
- URL: `http://localhost:4000/books`
- JSON body:

```json
{
  "id": 4,
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "price": 550,
  "category": "Programming"
}
```

- Expected: HTTP `201` and `Book added successfully`.

## 4. PUT (update) a book

- Method: `PUT`
- URL: `http://localhost:4000/books/1`
- JSON body:

```json
{
  "title": "The Alchemist - Updated",
  "author": "Paulo Coelho",
  "price": 399,
  "category": "Fiction"
}
```

- Expected: HTTP `200` and `Book updated successfully`.
- This implementation merges the supplied fields with the existing book; the ID in the URL remains unchanged.

## 5. DELETE a book

- Method: `DELETE`
- URL: `http://localhost:4000/books/1`
- Expected: HTTP `200` and `Book deleted successfully`.

Run the requests in this order to demonstrate add, update and delete. The data is stored in memory, so restarting the server resets it to the three sample books.

## Optional error checks

- `GET http://localhost:4000/books/999` -> HTTP `404`.
- `POST http://localhost:4000/books` with a missing title or invalid price -> HTTP `400`.
- `GET http://localhost:4000/not-a-route` -> HTTP `404`.
