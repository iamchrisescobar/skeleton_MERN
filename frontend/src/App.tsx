import React, { useEffect, useState } from 'react';
import { Note as NoteModel } from './models/note';
import { Button, Col, Container, Row} from 'react-bootstrap';
import Note from './components/Note';
import styles from "./styles/NotesPage.module.css";
import styleUtils from "./styles/utils.module.css";
import * as NotesAPI from "./network/notes_api";
import AddNotesDialog from './components/AddNotesDialog';

function App() {
  const [notes, setNotes] = useState<NoteModel[]>([]);

  const [showAddNoteDialog, setShowAddNoteDialog] = useState(false);


  useEffect(() => {
    async function loadNotes() {
      try {
        const notes = await NotesAPI.fetchNotes();
        setNotes(notes);
      } catch (error) {
        console.error(error);
        alert(error);
      }
    }
    loadNotes();
  }, []); // if you want something to exec 1 time, pass an empty array for dependency list 

  async function deleteNote(note: NoteModel) {
    try {
      await NotesAPI.deleteNote(note._id);
      setNotes(notes.filter(existingNote => existingNote._id !== note._id));
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }
  
  return (
    <Container>
      <Button 
        className={`mb-4 ${styleUtils.blockCenter}`}
        onClick={() => setShowAddNoteDialog(true)}>
        Add New Note
      </Button>
      <Row xs={1} md={2} xl={3} className='g-4'>
        {notes.map(note => (
          <Col key={note._id}>
            <Note 
            note={note}
            onDeleteNoteClick={deleteNote}
            className={styles.note} 
            />
          </Col>
          
        ))}
      </Row>
      { showAddNoteDialog &&
        <AddNotesDialog 
          onDismiss={() => setShowAddNoteDialog(false)}
          onNoteSaved={(newNote) => {
            setNotes([...notes, newNote]);
            setShowAddNoteDialog(false);

          }}
        />

      }
    </Container>
  );
}

export default App;
