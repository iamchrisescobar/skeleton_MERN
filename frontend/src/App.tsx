import React, { useEffect, useState } from "react";
import { Note as NoteModel } from "./models/note";
import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
import Note from "./components/Note";
import styles from "./styles/NotesPage.module.css";
import styleUtils from "./styles/utils.module.css";
import * as NotesAPI from "./network/notes_api";
import AddEditNotesDialog from "./components/AddEditNotesDialog";
import { FaPlus } from "react-icons/fa";

function App() {
    const [notes, setNotes] = useState<NoteModel[]>([]);
    const [notesLoading, setNotesLoading] = useState(true);
    const [showNotesLoadingError, setShowNotesLoadingError] = useState(false);
    
    const [showAddNoteDialog, setShowAddNoteDialog] = useState(false);
    const [noteToEdit, setNoteToEdit] = useState<NoteModel | null>(null);

    useEffect(() => {
        async function loadNotes() {
            try {
                setShowNotesLoadingError(false);
                setNotesLoading(true);
                const notes = await NotesAPI.fetchNotes();
                setNotes(notes);
            } catch (error) {
                console.error(error);
                setShowNotesLoadingError(true);
            } finally {
                setNotesLoading(false);
            }
        }
        loadNotes();
    }, []); // if you want something to exec 1 time, pass an empty array for dependency list

    async function deleteNote(note: NoteModel) {
        try {
            await NotesAPI.deleteNote(note._id);
            setNotes(notes.filter((existingNote) => existingNote._id !== note._id));
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

    const notesGrid =
        <Row xs={1} md={2} xl={3} className={`g-4 ${styles.notesGrid}`}>
            {notes.map((note) => (
                <Col key={note._id}>
                    <Note
                        note={note}
                        onNoteClicked={setNoteToEdit}
                        onDeleteNoteClick={deleteNote}
                        className={styles.note}
                    />
                </Col>
            ))}
        </Row>

    return (
        <Container className={styles.notesPage}>
            <Button
                className={`mb-4 ${styleUtils.blockCenter} ${styleUtils.flexcenter}`}
                onClick={() => setShowAddNoteDialog(true)}
            >
                <FaPlus />
                Add New Note
            </Button>
            {notesLoading && <Spinner animation="border" variant="primary" />} 
            {showNotesLoadingError && <p>Something went wront. Please refresh the page</p>}
            {!notesLoading && !showNotesLoadingError &&
            <>
            { notes.length > 0
                ? notesGrid
                : <p>You do not have any notes yet</p>
            }
            </>
            }
            {showAddNoteDialog && (
                <AddEditNotesDialog
                    onDismiss={() => setShowAddNoteDialog(false)}
                    onNoteSaved={(newNote) => {
                        setNotes([...notes, newNote]);
                        setShowAddNoteDialog(false);
                    }}
                />
            )}
            {noteToEdit && (
                <AddEditNotesDialog
                    noteToEdit={noteToEdit}
                    onDismiss={() => setNoteToEdit(null)}
                    onNoteSaved={(updatedNote) => {
                        setNotes(
                            notes.map((existingNote) =>
                                existingNote._id === updatedNote._id
                                    ? updatedNote
                                    : existingNote
                            )
                        );
                        setNoteToEdit(null);
                    }}
                />
            )}
        </Container>
    );
}

export default App;
