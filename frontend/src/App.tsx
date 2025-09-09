import React, { useEffect, useState } from "react";
import { Note as NoteModel } from "./models/note";
import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
import Note from "./components/Note";
import styles from "./styles/NotesPage.module.css";
import styleUtils from "./styles/utils.module.css";
import * as NotesAPI from "./network/notes_api";
import AddEditNotesDialog from "./components/AddEditNotesDialog";
import { FaPlus } from "react-icons/fa";
import SignUpModal from "./components/SignUpModal";
import LoginModal from "./components/LogInModal";
import NavBar from "./components/NavBar";

function App() {
    // STATE MANAGEMENT
    // --------------------------------------------------------------------------
    // Main notes array - stores all user notes fetched from API
    const [notes, setNotes] = useState<NoteModel[]>([]);
    
    // Loading state - indicates if notes are currently being fetched
    const [notesLoading, setNotesLoading] = useState(true);
    
    // Error state - set to true if note fetching fails
    const [showNotesLoadingError, setShowNotesLoadingError] = useState(false);
    
    // Modal control - determines if add note dialog should be displayed
    const [showAddNoteDialog, setShowAddNoteDialog] = useState(false);
    
    // Edit state - holds the note to be edited, null when not in edit mode
    const [noteToEdit, setNoteToEdit] = useState<NoteModel | null>(null);

    // DATA FETCHING EFFECT
    // --------------------------------------------------------------------------
    useEffect(() => {
        async function loadNotes() {
            try {
                // Reset error state and set loading to true before API call
                setShowNotesLoadingError(false);
                setNotesLoading(true);
                
                // Fetch notes from API - this is the primary data initialization
                const notes = await NotesAPI.fetchNotes();
                setNotes(notes);
                
            } catch (error) {
                // Handle API errors gracefully with user feedback
                console.error("Failed to load notes:", error);
                setShowNotesLoadingError(true);
                
            } finally {
                // Ensure loading state is reset regardless of success/failure
                setNotesLoading(false);
            }
        }
        
        // Execute data fetching on component mount
        loadNotes();
        
    }, []); // Empty dependency array ensures this runs only once on mount

    // NOTE DELETION HANDLER
    // --------------------------------------------------------------------------
    async function deleteNote(note: NoteModel) {
        try {
            // Optimistic UI update: remove from local state immediately
            // In production, consider adding a confirmation dialog
            await NotesAPI.deleteNote(note._id);
            
            // Filter out the deleted note from local state
            setNotes(notes.filter((existingNote) => existingNote._id !== note._id));
            
        } catch (error) {
            // Error handling: log and alert user
            console.error("Failed to delete note:", error);
            alert(`Delete failed: ${error}`);
            
            // Note: In a production app, we might want to revert the optimistic update
            // or implement a retry mechanism
        }
    }

    // UI COMPONENTS
    // --------------------------------------------------------------------------
    // Notes grid component - memoize this if performance becomes an issue
    // with large numbers of notes
    const notesGrid =
        <Row xs={1} md={2} xl={3} className={`g-4 ${styles.notesGrid}`}>
            {notes.map((note) => (
                <Col key={note._id}>
                    <Note
                        note={note}
                        onNoteClicked={setNoteToEdit} // Set note to edit on click
                        onDeleteNoteClick={deleteNote}
                        className={styles.note}
                    />
                </Col>
            ))}
        </Row>

    // MAIN RENDER
    // --------------------------------------------------------------------------
    return (
        <div>
            <NavBar 
            loggedInUser={null}
            onLoginClicked={() => { }}
            onSignUpClicked={() => { }}
            onLogoutSuccessfull={() => { }}
            />
        <Container className={styles.notesPage}>
            {/* ADD NOTE BUTTON */}
            <Button
                className={`mb-4 ${styleUtils.blockCenter} ${styleUtils.flexcenter}`}
                onClick={() => setShowAddNoteDialog(true)}
                aria-label="Add new note"
            >
                <FaPlus />
                Add New Note
            </Button>

            {/* LOADING STATE */}
            {notesLoading && <Spinner animation="border" variant="primary" />} 
            
            {/* ERROR STATE */}
            {showNotesLoadingError && 
                <p>Something went wrong. Please refresh the page</p>
            }
            
            {/* CONTENT STATE MANAGEMENT */}
            {!notesLoading && !showNotesLoadingError &&
            <>
                { notes.length > 0
                    ? notesGrid
                    : <p>You do not have any notes yet</p>
                }
            </>
            }

            {/* ADD NOTE MODAL */}
            {showAddNoteDialog && (
                <AddEditNotesDialog
                    onDismiss={() => setShowAddNoteDialog(false)}
                    onNoteSaved={(newNote) => {
                        // Add new note to beginning of array for better UX
                        setNotes([newNote, ...notes]);
                        setShowAddNoteDialog(false);
                    }}
                />
            )}

            {/* EDIT NOTE MODAL */}
            {noteToEdit && (
                <AddEditNotesDialog
                    noteToEdit={noteToEdit}
                    onDismiss={() => setNoteToEdit(null)}
                    onNoteSaved={(updatedNote) => {
                        // Update specific note in array while maintaining order
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
            { false &&
            <SignUpModal 
            onDismiss={() => { }}
            onSignUpSuccesful={() => { }}
            />
            }
            { false &&
            <LoginModal 
            onDismiss={() => { }}
            onLoginSuccesful={() => { }}
            />
            }
        </Container>
        </div>
    );
}

export default App;