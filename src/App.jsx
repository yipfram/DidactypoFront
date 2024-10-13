import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import './style/App.css'

import Header from './elements/Header'
import Footer from './elements/Footer'

import Accueil from './pages/Accueil'
import Apprendre from './pages/Apprendre'
import Competition from './pages/Competition'
import MaClasse from './pages/MaClasse'
import MesInformations from './pages/MesInformations'

export default function App() {

  return (
    <>
      <BrowserRouter>
        <Header title="Stylé le header" />
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/apprendre" element={<Apprendre />} />
          <Route path="/competition" element={<Competition />} />
          <Route path="/maclasse" element={<MaClasse />} />
          <Route path="/mesinformations" element={<MesInformations />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  )
}
