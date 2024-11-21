
'use client'

import { useState, useEffect } from 'react'

interface Book {
  id: number
  title: string
  author: string
  available: boolean
}

export default function BookData() {
  const [books, setBooks] = useState<Book[]>([])
  const [newBook, setNewBook] = useState<{ title: string; author: string; available: boolean }>({
    title: '',
    author: '',
    available: true,
  })
  const [updateBookId, setUpdateBookId] = useState<number | null>(null)
  const [updatedBook, setUpdatedBook] = useState<{ title: string; author: string; available: boolean }>({
    title: '',
    author: '',
    available: true,
  })
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/books')
      const data = await res.json()
      setBooks(data)
    } catch (err) {
      setError('Failed to fetch books')
    } finally {
      setLoading(false)
    }
  }

  const handleAddBook = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBook),
      })

      const addedBook = await res.json()
      if (res.status === 201) {
        setBooks([...books, addedBook])
        setNewBook({ title: '', author: '', available: true }) // Clear form
      }
    } catch (err) {
      setError('Failed to add book')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateBook = async () => {
    if (updateBookId === null) return

    setLoading(true)
    try {
      const res = await fetch('/api/books', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: updateBookId, ...updatedBook }),
      })

      const updated = await res.json()
      if (res.status === 200) {
        setBooks(books.map((book) => (book.id === updateBookId ? updated : book)))
        setUpdateBookId(null) // Clear form
        setUpdatedBook({ title: '', author: '', available: true })
      }
    } catch (err) {
      setError('Failed to update book')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteBook = async (id: number) => {
    setLoading(true)
    try {
      const res = await fetch('/api/books', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })

      if (res.status === 200) {
        setBooks(books.filter((book) => book.id !== id))
      }
    } catch (err) {
      setError('Failed to delete book')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Books</h1>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      {/* Add Book Form */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Add a New Book</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={newBook.title}
            onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md"
            disabled={loading}
          />
          <input
            type="text"
            placeholder="Author"
            value={newBook.author}
            onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md"
            disabled={loading}
          />
          <button
            onClick={handleAddBook}
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Book'}
          </button>
        </div>
      </div>

      {/* Update Book Form */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Update a Book</h2>
        <div className="space-y-4">
          <input
            type="number"
            placeholder="Book ID"
            value={updateBookId ?? ''}
            onChange={(e) => setUpdateBookId(Number(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded-md"
            disabled={loading}
          />
          <input
            type="text"
            placeholder="New Title"
            value={updatedBook.title}
            onChange={(e) => setUpdatedBook({ ...updatedBook, title: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md"
            disabled={loading}
          />
          <input
            type="text"
            placeholder="New Author"
            value={updatedBook.author}
            onChange={(e) => setUpdatedBook({ ...updatedBook, author: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md"
            disabled={loading}
          />
          <button
            onClick={handleUpdateBook}
            className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Book'}
          </button>
        </div>
      </div>

      {/* Books List */}
      <h2 className="text-xl font-semibold mb-4">Books List</h2>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <ul className="space-y-4">
          {books.map((book) => (
            <li key={book.id} className="flex justify-between items-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div>
                <p className="font-semibold">{book.title}</p>
                <p className="text-gray-500">{book.author}</p>
              </div>
              <button
                onClick={() => handleDeleteBook(book.id)}
                className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}