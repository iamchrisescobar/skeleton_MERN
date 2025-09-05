import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import { Button, Col, Container, Row} from 'react-bootstrap';
import { click } from '@testing-library/user-event/dist/click';
import { Note as NoteModel } from './models/note'
import Note from './components/Note'
import styles from "./styles/NotesPage.module.css"

function App() {
  const [notes, setNotes] = useState<NoteModel[]>([]);

  useEffect(() => {
    async function loadNotes() {
      try {
        const response = await fetch("/api/notes", {method: "GET"});
        const notes = await response.json();
        setNotes(notes);
      } catch (error) {
        console.error(error);
        alert(error);
      }
    }
    loadNotes();
  }, []); // if you want something to exec 1 time, pass an empty array for dependency list 

  return (
    <Container>
      <Row xs={1} md={2} xl={3} className='g-4'>
        {notes.map(note => (
          <Col key={note._id}>
            <Note note={note} className={styles.note} />
          </Col>
          
        ))}
      </Row>
    </Container>
  );
}

export default App;
