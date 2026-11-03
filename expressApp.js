import express from 'express';

const app = express();
const PORT = 4000;

// B1: Parse incoming JSON request bodies.
app.use(express.json({ limit: '1mb' }));

// B1/B3: In-memory sample data. The application does not use a database.
const books = [
  { id: 1, title: 'The Alchemist', author: 'Paulo Coelho', price: 350, category: 'Fiction' },
  { id: 2, title: 'Atomic Habits', author: 'James Clear', price: 450, category: 'Self-help' },
  { id: 3, title: 'Wings of Fire', author: 'A. P. J. Abdul Kalam', price: 300, category: 'Biography' }
];

function validateBook(book, { requireId = true } = {}) {
  if (!book || typeof book !== 'object' || Array.isArray(book)) {
    return 'Request body must be a JSON object.';
  }
  if (requireId && (book.id === undefined || book.id === null || String(book.id).trim() === '')) {
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

function getNumericId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

// GET /books - Retrieve all books.
app.get('/books', (request, response) => {
  response.status(200).json(books);
});

// GET /books/:id - Retrieve one book by its ID.
app.get('/books/:id', (request, response) => {
  const id = getNumericId(request.params.id);
  const book = id === null ? undefined : books.find((item) => item.id === id);

  if (!book) {
    return response.status(404).json({ error: 'Book not found.' });
  }
  return response.status(200).json(book);
});

// POST /books - Add a new book. Category is optional and gets a default value.
app.post('/books', (request, response) => {
  const validationError = validateBook(request.body);
  if (validationError) {
    return response.status(400).json({ error: validationError });
  }

  const id = getNumericId(request.body.id);
  if (id === null) {
    return response.status(400).json({ error: 'Book id must be a positive integer.' });
  }
  if (books.some((book) => book.id === id)) {
    return response.status(409).json({ error: `A book with id ${id} already exists.` });
  }

  const newBook = {
    id,
    title: request.body.title.trim(),
    author: request.body.author.trim(),
    price: Number(request.body.price),
    category: typeof request.body.category === 'string' && request.body.category.trim()
      ? request.body.category.trim()
      : 'Uncategorized'
  };

  books.push(newBook);
  return response.status(201).json({ message: 'Book added successfully', book: newBook });
});

// PUT /books/:id - Update the provided fields of an existing book.
app.put('/books/:id', (request, response) => {
  const id = getNumericId(request.params.id);
  const bookIndex = id === null ? -1 : books.findIndex((item) => item.id === id);

  if (bookIndex === -1) {
    return response.status(404).json({ error: 'Book not found.' });
  }
  if (!request.body || typeof request.body !== 'object' || Array.isArray(request.body) || Object.keys(request.body).length === 0) {
    return response.status(400).json({ error: 'Request body must be a non-empty JSON object.' });
  }

  const currentBook = books[bookIndex];
  const updatedBook = { ...currentBook, ...request.body, id };
  const validationError = validateBook(updatedBook, { requireId: false });
  if (validationError) {
    return response.status(400).json({ error: validationError });
  }

  updatedBook.title = updatedBook.title.trim();
  updatedBook.author = updatedBook.author.trim();
  updatedBook.price = Number(updatedBook.price);
  updatedBook.category = typeof updatedBook.category === 'string' && updatedBook.category.trim()
    ? updatedBook.category.trim()
    : 'Uncategorized';

  books[bookIndex] = updatedBook;
  return response.status(200).json({ message: 'Book updated successfully', book: updatedBook });
});

// DELETE /books/:id - Remove a book from the array.
app.delete('/books/:id', (request, response) => {
  const id = getNumericId(request.params.id);
  const bookIndex = id === null ? -1 : books.findIndex((item) => item.id === id);

  if (bookIndex === -1) {
    return response.status(404).json({ error: 'Book not found.' });
  }

  const [deletedBook] = books.splice(bookIndex, 1);
  return response.status(200).json({ message: 'Book deleted successfully', book: deletedBook });
});

// Return JSON for all unknown routes.
app.use((request, response) => {
  response.status(404).json({ error: 'Route not found.' });
});

// Handle malformed JSON and other middleware errors consistently.
app.use((error, request, response, next) => {
  if (response.headersSent) {
    return next(error);
  }
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return response.status(400).json({ error: 'Invalid JSON in request body.' });
  }
  if (error.status === 413) {
    return response.status(413).json({ error: 'Request body is too large. Maximum size is 1 MB.' });
  }
  return response.status(500).json({ error: 'Internal server error.' });
});

app.listen(PORT, () => {
  console.log(`Express Server running at http://localhost:${PORT}`);
});
