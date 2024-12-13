import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './style/App.css';
import Header from './elements/Header';
import Footer from './elements/Footer';
import Loading from './elements/Loading';

const Accueil = lazy(() => import('./pages/Accueil'));
const Apprendre = lazy(() => import('./pages/Apprendre'));
const Competition = lazy(() => import('./pages/Competition'));
const MaClasse = lazy(() => import('./pages/MaClasse'));
const MesInformations = lazy(() => import('./pages/MesInformations'));
const Compte = lazy(() => import('./pages/Compte'));
const Sinscrire = lazy(() => import('./pages/Sinscrire'));
const NotFound = lazy(() => import('./pages/NotFound'));
const ListeCours = lazy(() => import('./pages/ListeCours'));
const ListeExercices = lazy(() => import('./pages/ListeExercices'));

export default function App() {
  return (
    <>
      <BrowserRouter>
        <div>
          <Header />
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<Accueil />} />
              <Route path="/apprendre" element={<Apprendre />} />
              <Route path="/competition" element={<Competition />} />
              <Route path="/maclasse" element={<MaClasse />} />
              <Route path="/mesinformations" element={<MesInformations />} />
              <Route path="/compte" element={<Compte />} />
              <Route path="/inscription" element={<Sinscrire />} />
              <Route path="/listeCours" element={<ListeCours />} />
              <Route path="/listeExercices" element={<ListeExercices />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </div>
        <Footer />
      </BrowserRouter>
    </>
  );
}
