# MT1-LABEXAM - Library Book Management Web Application

This project follows the uploaded MT1 Lab Examination question. It uses Node.js ES Modules, the built-in `http` and `fs` modules for Part A, and Express.js for Part B. No database is used; book records are stored in JavaScript arrays.

## 1. Project structure

```text
MT1-LABEXAM/
├── package.json
├── httpServer.js
├── expressApp.js
├── API-TESTS.md
├── README.md
├── .gitignore
├── public/
│   └── index.html
└── screenshots/
    └── .gitkeep
```

## 2. Requirements

- Install Node.js (LTS version recommended).
- Open this project folder in VS Code or a terminal.
- Internet connection is needed once to install Express.js.

## 3. Install dependencies

Open a terminal inside the `MT1-LABEXAM` folder and run:

```bash
npm install
```

## 4. Run Part A - built-in HTTP and FS modules

In Terminal 1, run:

```bash
npm run start:http
```

Expected terminal message:

```text
HTTP Server running at http://localhost:3000
```

Open these URLs in your browser:

| URL | Expected result |
|---|---|
| `http://localhost:3000/` | Welcome page in HTML |
| `http://localhost:3000/books` | Books in JSON format |
| `http://localhost:3000/about` | Library application information |
| `http://localhost:3000/home` | `public/index.html` served using the FS module |

To add a book to Part A, use EchoAPI/Postman or another API client:

- Method: `POST`
- URL: `http://localhost:3000/add-book`
- Header: `Content-Type: application/json`
- Body -> raw -> JSON:

```json
{
  "id": 4,
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "price": 550
}
```

Expected status: `201 Created`. Then open `/books` again to see the new record. The Part A server accepts `GET /books` and `POST /add-book` as required.

## 5. Run Part B - Express REST API

Keep Part A running. Open a second terminal in the same project folder and run:

```bash
npm run start:express
```

Expected terminal message:

```text
Express Server running at http://localhost:4000
```

Use EchoAPI to test the following endpoints:

| Method | URL | Expected result |
|---|---|---|
| GET | `http://localhost:4000/books` | All books, status 200 |
| GET | `http://localhost:4000/books/1` | Book with ID 1, status 200 |
| POST | `http://localhost:4000/books` | Add book, status 201 |
| PUT | `http://localhost:4000/books/1` | Update book, status 200 |
| DELETE | `http://localhost:4000/books/1` | Delete book, status 200 |

For the exact request bodies and expected results, open `API-TESTS.md`.

## 6. Screenshots for submission

Save your own screenshots in the `screenshots/` folder. Capture:

1. Part A terminal showing the HTTP server on port 3000.
2. Browser showing `http://localhost:3000/home` (this demonstrates FS file serving).
3. Part B terminal showing the Express server on port 4000.
4. EchoAPI results for GET all books and GET one book.
5. EchoAPI results for POST, PUT and DELETE.
6. GitHub repository page showing the `MT1-LABEXAM` files and commit history.

Screenshots are intentionally not fabricated or included; capture them from your own running application and GitHub repository.

## 7. Push the project to GitHub

Create a GitHub repository named `MT1-LABEXAM`. Then run these commands from the project folder, replacing the URL with your own repository URL:

```bash
git init
git add .
git commit -m "Initial project setup"
git branch -M main
git remote add origin https://github.com/YOUR-GITHUB-USERNAME/MT1-LABEXAM.git
git push -u origin main
```

After completing and testing each module, save your changes with meaningful commits, for example:

```bash
git add .
git commit -m "Implement Node HTTP server and FS static page"
git push

git add .
git commit -m "Implement Express book CRUD APIs"
git push
```

## 8. Important notes

- Run the two applications in separate terminals. They use different ports: `3000` and `4000`.
- Do not run `node httpServer.js` and `node expressApp.js` in the same terminal at the same time.
- There is no database. Data is stored in memory and resets when the relevant server restarts.
- `node_modules/` is not included in the ZIP. Run `npm install` after extracting the project.
