import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

import api from '../api';

import Loading from '../elements/Components/Loading';
import VerifConnection from '../elements/CompteUtilisateur/VerifConnexion';
import Modal from '../elements/Components/Modal';
import QuitterClasse from '../elements/Classe/QuitterClasse';
import AjouterEleve from '../elements/Classe/AjouterEleve';

import style from "../style/MaClasse.module.css";

import Chat from '../elements/Chat/Chat';
import MembresClasse from '../elements/Classe/MembresClasse';

export default function MaClasse() {
  const { id } = useParams();
  const [decodedToken, setDecodedToken] = useState(null);
  const [classe, setClasse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);
  const [isLeaveOpen, setIsLeaveOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    if (token) {
      try {
        setDecodedToken(jwtDecode(token));
      } catch (error) {
        console.error("Erreur de décodage du token:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (!decodedToken || !id) return;
  
    const fetchClasseData = async () => {
      try {
        const responseUserClasses = await api.get(`/membre_classes/${decodedToken.sub}`);
  
        const userClasses = responseUserClasses.data.map(c => c.id_groupe);
  
        if (userClasses.includes(Number(id))) {
          setIsMember(true);
          
          const responseClasse = await api.get(`/groupe/${id}`);
          setClasse(responseClasse.data);
        } else {
          setIsMember(false);
        }
      } catch (error) {
        console.error("❌ Erreur récupération classe:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchClasseData();
  }, [decodedToken, id]);
  
  

  // Optimisation des fonctions de gestion des modals avec useCallback
  const handleOpenAdd = useCallback(() => setIsAddOpen(true), []);
  const handleCloseAdd = useCallback(() => setIsAddOpen(false), []);
  const handleOpenLeave = useCallback(() => setIsLeaveOpen(true), []);
  const handleCloseLeave = useCallback(() => setIsLeaveOpen(false), []);

  return (
    <VerifConnection>
      {decodedToken ? (
        <main className={style.pageClasse}>
          {loading ? (
            <Loading />
          ) : isMember && classe ? (
            <>
              <div className={style.classegauche}>
                <div className={style.classe}>
                  <h2>{classe.nom_groupe}</h2>
                  <h3>Description: {classe.description_groupe}</h3>
                  <h3>Code pour rejoindre la classe: <strong style={{ color: 'red' }}>{id}</strong></h3>
                </div>
                <button className={style.btnajouter} onClick={handleOpenAdd}>Ajouter un élève</button>
                <button className={style.btnQuitter} onClick={handleOpenLeave}>Quitter la classe</button>
              </div>

              <Modal show={isLeaveOpen} onClose={handleCloseLeave}>
                <QuitterClasse pseudo_utilisateur={decodedToken.sub} id_groupe={id} />
                <button onClick={handleCloseLeave}>Annuler</button>
              </Modal>

              <Modal show={isAddOpen} onClose={handleCloseAdd}>
                <AjouterEleve id_groupe={id} />
                <button onClick={handleCloseAdd}>Annuler</button>
              </Modal>

              <Chat class_id={id} utilisateur={decodedToken.sub} />
              <MembresClasse idClasse={id} />
            </>
          ) : (
            !loading && (
              <main className={style.pageClasseNotJoined}>
                <h1>Vous n'êtes pas membre de cette classe ou elle n'existe pas.</h1>
                <Link to="/classe">Retour à l'accueil</Link>
              </main>
            )
          )}
        </main>
      ) : (
        <main>
          <h1>Vous devez être connecté pour accéder à cette classe</h1>
          <Link to="/profil/connecter">Se connecter !</Link>
        </main>
      )}
    </VerifConnection>
  );
}
