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
import Compte from './pages/Compte'
import Sinscrire from './pages/Sinscrire'
import NotFound from './pages/NotFound'
import ListeCours from './pages/ListeCours'
import ListeExercices from './pages/ListeExercices'

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
          <Route path="/compte" element={<Compte />} />
          <Route path="/inscription" element={<Sinscrire />} />
        
          <Route path="/listeCours" element={<ListeCours/>}/>
          <Route path="/listeExercices" element={<ListeExercices/>}/>
    
          <Route path="*" element={<NotFound/>} />
          
          <Route path="/*" element={<NotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  )
}
