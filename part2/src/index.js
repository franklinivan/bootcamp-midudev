// Explicación: viedeo 5 - Fetching y mutación de datos
import ReactDOM from 'react-dom'
import './App.css'
import { useEffect, useState } from 'react'
import noteService from './services/notes'
import loginService from './services/login'

// components
import RenderCreateNoteForm from './components/NoteForm'
import RenderLoginForm from './components/LoginForm'
import Note from './components/Note'

function App () {
  const [notes, setNotes] = useState([])
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    noteService.getAll().then(initialNotes => setNotes(initialNotes))
  }, [])

  useEffect(() => {
    const loggedUser = window.localStorage.getItem('loggedNoteAppUser')
    if (loggedUser) {
      const user = JSON.parse(loggedUser)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])

  const addNote = noteObject => {
    noteService
      .create(noteObject)
      .then(newNote => setNotes(prevNotes => prevNotes.concat(newNote)))
  }

  const toggleImportance = (id) => {
    console.log('ndeahh')
    // const note = notes.find(n => n.id === id)
    // const changedNote = { ...note, important: !note.important }

    // return () => {
    //   noteService.update(id, changedNote)
    //     .then(returnedNote => {
    //       setNotes(notes.map(note => note.id !== id ? note : returnedNote))
    //     })
    // }
  }

  const handleShowNotes = () => setShowAll(prev => !prev)
  const notesToShow = showAll ? notes : notes.filter(n => n.important === true)

  const handleLogin = async credentials => {
    try {
      const user = await loginService.login(credentials)
      setUser(user)

      window.localStorage.setItem('loggedNoteAppUser', JSON.stringify(user))
      noteService.setToken(user.token)

    } catch (error) {
      console.error(error)
      setErrorMessage('invalid user or password')

      setTimeout(() => {
        setErrorMessage('')
      }, 5000)

    }
  }

  const handleLogout = () => {
    setUser(null)
    noteService.setToken(null)
    window.localStorage.removeItem('loggedNoteAppUser')
  }

  return (
    <div>
      <h1>Notes</h1>
      <p>{errorMessage}</p>

      {
        user === null
          ? <RenderLoginForm
              handleLogin={handleLogin}
            />

          : <RenderCreateNoteForm
              addNote={addNote}
              handleLogout={handleLogout}
            />
      }

      <button onClick={handleShowNotes}>
        {showAll ? 'show only important' : 'show all'}
      </button>

      <ol>
        {
          notesToShow
            .map(note => 
              <Note 
                key={note.id} 
                note={note} 
                toggleImportance={toggleImportance}
              />
            )
        }
      </ol>

    </div>
  )
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
