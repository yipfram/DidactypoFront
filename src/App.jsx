import { React, useState } from 'react'
import './App.css'

import Header from './elements/Header'
import Footer from './elements/Footer'

import Accueil from './pages/Accueil'

function App() {

  return (
    <>
      <Header title="Stylé le header"/>
      <Accueil/>
      <Footer/>
    </>
  )
}

export default App
