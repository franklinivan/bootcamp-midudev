import React from "react";
import { Link, Route, Routes } from 'react-router-dom'
import NoteDetail from "./components/NoteDetail";
import Notes from './Notes'
import Login from "./Login";

const Home = () => <h1>Home</h1>
const Users = () => <h1>Users</h1>

const inlinesStyles = {
  padding: 5
}

export default function App() {
  return (
    <div>
      <header>
        <Link to="/" style={inlinesStyles}>Home</Link>
        <Link to="/notes"  style={inlinesStyles}>Notes</Link>
        <Link to="/users"  style={inlinesStyles}>Users</Link>
        <Link to="/login"  style={inlinesStyles}>Login</Link>
      </header>
      <Routes>
        <Route path='/' element={ <Home /> } />
        <Route path='/notes' element={ <Notes /> } />
        <Route path='/notes/:id' element={ <NoteDetail /> } />
        <Route path='/users' element={ <Users /> } />
        <Route path='/login' element={ <Login /> } />
      </Routes>
    </div>
  )
}
