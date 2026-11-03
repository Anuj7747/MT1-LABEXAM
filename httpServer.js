import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PORT = 3000;
const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const homePagePath = path.join(currentDirectory, 'public', 'index.html');

// In-memory data for Part A. No database is used in this lab.
const books = [
  { id: 1, title: 'The Alchemist', author: 'Paulo Coelho', price: 350 },
  { id: 2, title: 'Atomic Habits', author: 'James Clear', price: 450 },
  { id: 3, title: 'Wings of Fire', author: 'A. P. J. Abdul Kalam', price: 300 }
];

function sendJson(response, statusCode, data) {
  response.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(data, null, 2));
}

function sendText(response, statusCode, message) {
  response.writeHead(statusCode, { 'Content-Type': 'text/plain; charset=utf-8' });
  response.end(message);
}

function validateBook(book) {
  if (!book || typeof book !== 'object' || Array.isArray(book)) {
    return 'Request body must be a JSON object.';
  }
  if (book.id === undefined || book.id === null || String(book.id).trim() === '') {
    return 'Book id is required.';
  }
  if (typeof book.title !== 'string' || !book.title.trim()) {
    return 'Book title is required.';
  }
  if (typeof book.author !== 'string' || !book.author.trim()) {
    return 'Book author is required.';
  }
  if (book.price === undefined || book.price === null || book.price === '' || !Number.isFinite(Number(book.price)) || Number(book.price) < 0) {
    return 'Book price must be a valid non-negative number.';
  }
  return null;
}

async function readJsonBody(request) {
  const chunks = [];
  let totalBytes = 0;
  const maxBytes = 1024 * 1024;

  for await (const chunk of request) {
    totalBytes += chunk.length;
    if (totalBytes > maxBytes) {
      const error = new Error('Request body is too large. Maximum size is 1 MB.');
      error.statusCode = 413;
      throw error;
    }
    chunks.push(chunk);
  }

  const rawBody = Buffer.concat(chunks).toString('utf8');
  if (!rawBody.trim()) {
    const error = new Error('Request body is required. Send a JSON object.');
    error.statusCode = 400;
    throw error;
  }

  try {
    return JSON.parse(rawBody);
  } catch {
    const error = new Error('Invalid JSON in request body.');
    error.statusCode = 400;
    throw error;
  }
}

const server = http.createServer(async (request, response) => {
  const requestUrl = new URL(request.url, `http://${request.headers.host || 'localhost'}`);
  const route = requestUrl.pathname;
  const method = request.method;

  try {
    // A2: Basic routing.
    if (method === 'GET' && route === '/') {
      response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      response.end(`<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Library Management</title></head>
<body>
  <h1>Welcome to the Library Book Management Application</h1>
  <p>Node.js HTTP and FS module lab exercise.</p>
  <ul>
    <li><a href="/books">View books (JSON)</a></li>
    <li><a href="/about">About this application</a></li>
    <li><a href="/home">Open home page from the public folder</a></li>
  </ul>
</body>
</html>`);
      return;
    }

    // A3: GET /books returns every book in the Part A array.
    if (method === 'GET' && route === '/books') {
      sendJson(response, 200, books);
      return;
    }

    if (method === 'GET' && route === '/about') {
      response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      response.end('<h1>About Library Management</h1><p>This application demonstrates Node.js HTTP routing, JSON responses and static HTML serving with the FS module.</p>');
      return;
    }

    // A4: Serve public/index.html using Node's built-in FS module.
    if (method === 'GET' && route === '/home') {
      try {
        const html = await readFile(homePagePath, 'utf8');
        response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        response.end(html);
      } catch (error) {
        console.error('Could not read public/index.html:', error.message);
        sendJson(response, 500, { error: 'Unable to load the home page.' });
      }
      return;
    }

    // A3: POST /add-book accepts a JSON book object and stores it in the array.
    if (method === 'POST' && route === '/add-book') {
      const newBook = await readJsonBody(request);
      const validationError = validateBook(newBook);
      if (validationError) {
        sendJson(response, 400, { error: validationError });
        return;
      }

      if (books.some((book) => String(book.id) === String(newBook.id))) {
        sendJson(response, 409, { error: `A book with id ${newBook.id} already exists.` });
        return;
      }

      const savedBook = {
        id: newBook.id,
        title: newBook.title.trim(),
        author: newBook.author.trim(),
        price: Number(newBook.price)
      };
      books.push(savedBook);
      sendJson(response, 201, { message: 'Book added successfully', book: savedBook });
      return;
    }

    // Any unsupported route or HTTP method returns 404, as required in the question.
    sendJson(response, 404, { error: 'Route not found.' });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    sendJson(response, statusCode, { error: error.message || 'Internal server error.' });
  }
});

server.listen(PORT, () => {
  console.log(`HTTP Server running at http://localhost:${PORT}`);
});
