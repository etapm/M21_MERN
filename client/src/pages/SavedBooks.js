import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useQuery, useMutation } from "@apollo/client";

import Auth from "../utils/auth";
import { removeBookId } from "../utils/localStorage";

import { GET_ME } from "../utils/queries";
import { REMOVE_BOOK } from "../utils/mutations";

const SavedBooks = () => {
  const { loading, data } = useQuery(GET_ME);
  const [removeBook] = useMutation(REMOVE_BOOK);

  const userData = data?.me || {};

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await removeBook({
        variables: { bookId },
        update: (cache) => {
          const { me } = cache.readQuery({ query: GET_ME });
          cache.writeQuery({
            query: GET_ME,
            data: {
              me: {
                ...me,
                savedBooks: me.savedBooks.filter(
                  (book) => book.bookId !== bookId
                ),
              },
            },
          });
        },
      });

      // upon success, remove book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  if (loading) {
    return <h2>LOADING...</h2>;
  }
  return (
    <Container>
      <Row>
        {userData.savedBooks.map((book) => {
          return (
            <Col key={book.bookId} xs={12} md={6} lg={4}>
              <Card border="dark">
                {book.image ? (
                  <Card.Img
                    src={book.image}
                    alt={`The cover for ${book.title}`}
                    variant="top"
                  />
                ) : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className="small">Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button
                    className="btn-block btn-danger"
                    onClick={() => handleDeleteBook(book.bookId)}
                  >
                    Delete this Book
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
};

export default SavedBooks;
