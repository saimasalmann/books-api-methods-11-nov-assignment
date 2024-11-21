import { NextRequest, NextResponse } from "next/server";
// simulate a database 

const books = [
    {
        id: 1,
        title: "Harry Potter",
        author: "J.K.Rowling",
        available:true,
        
    }
]


//get request handler

export async function GET(){
    try {
        return NextResponse.json(books,{status:200})
    } catch (error) {
      return NextResponse.json(
        {message:'Error fetching books'},
        {status:500}
      )  
    }
}

export async function POST(request:NextRequest) {
  try {
    const newBook = await request.json();
    const id = books.length + 1;
    const addedBook = { ...newBook, id }; // Add auto-incremented id
    books.push(addedBook);
    return NextResponse.json(addedBook, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error adding book' },
      { status: 500 }
    );
  }
}

// PUT Request: Update an existing book
export async function PUT(request:NextRequest) {
  try {
    const { id, title, author, available } = await request.json();
    const bookIndex = books.findIndex((book) => book.id === id);

    if (bookIndex === -1) {
      return NextResponse.json(
        { message: 'Book not found' },
        { status: 404 }
      );
    }

    // Update book
    books[bookIndex] = { id, title, author, available };
    return NextResponse.json(books[bookIndex], { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error updating book' },
      { status: 500 }
    );
  }
}

// DELETE Request: Delete a book by id
export async function DELETE(request:NextRequest) {
  try {
    const { id } = await request.json();
    const bookIndex = books.findIndex((book) => book.id === id);

    if (bookIndex === -1) {
      return NextResponse.json(
        { message: 'Book not found' },
        { status: 404 }
      );
    }

    // Remove book
    books.splice(bookIndex, 1);
    return NextResponse.json(
      { message: 'Book deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Error deleting book' },
      { status: 500 }
    );
  }
}