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
import SeConnecter from './pages/SeConnecter'
import Sinscrire from './pages/Sinscrire'
import NotFound from './pages/NotFound'

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
          <Route path="/seconnecter" element={<SeConnecter />} />
          <Route path="/sinscrire" element={<Sinscrire />} />
          
          <Route path="*" element={<NotFound/>} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  )
}
