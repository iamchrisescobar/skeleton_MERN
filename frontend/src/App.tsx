import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import { Button } from 'react-bootstrap';
import { click } from '@testing-library/user-event/dist/click';
import { Note as NoteModel } from './models/note'
import Note from './components/Note'
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
    <div>
      {notes.map(note => (
        <Note note={note} key={note._id} />
      ))}
    </div>
  );
}

export default App;
