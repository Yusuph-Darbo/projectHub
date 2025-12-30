import { useState } from 'react'
import './App.css'
import Header from './components/Header/Header.jsx'

function App() {

  return (
    <>
      <Header 
        title="Website Redesign Project"
        subtitle="Track and manage your project tasks"
        showBack
        // action={<button>+ Add Task</button>}
      />
    </>
  )
}

export default App
