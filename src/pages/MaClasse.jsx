import { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import { Link } from 'react-router-dom';

import api from '../api';

import Loading from '../elements/Components/Loading';
import VerifConnection from '../elements/CompteUtilisateur/VerifConnexion';
import Modal from '../elements/Components/Modal';
import CreerClasse from '../elements/Classe/CreerClasse';
import RejoindreClasse from '../elements/Classe/RejoindreClasse';
import QuitterClasse from '../elements/Classe/QuitterClasse';
import AjouterEleve from '../elements/Classe/AjouterEleve';

import style from "../style/MaClasse.module.css";

import Chat from '../elements/Chat/Chat';
import MembresClasse from '../elements/Classe/MembresClasse';

export default function MaClasse() {
  const [connected, setConnected] = useState(false);
  const [decodedToken, setDecodedToken] = useState(null);
  const [classe, setClasse] = useState(null);
  const [idClasse, setIdClasse] = useState(null);
  const [loadingClasse, setLoadingClasse] = useState(true);

  // Check connection status and decode token
  useEffect(() => {
    const token = window.localStorage.getItem("token");
    if (token) {
      setConnected(true);
      try {
        setDecodedToken(jwtDecode(token));
      } catch (error) {
        console.error("Error decoding token", error);
      }
    }
  }, []);

  useEffect(() => {
    if (decodedToken) {
      const fetchClasse = async (userId) => {
        try {
          // Premier appel à l'api, vérifie si l'utilisateur à une classe
          const reponseIdClasse = await api.get(`/membre_classe/${userId}`);
          
          // Vérifie si l'utilisateur est dans un groupe
          if (!reponseIdClasse.data.id_groupe) {
            setLoadingClasse(false); // Arrêter le chargement si aucun groupe n'est trouvé
            return; // Quitter la fonction
          }
          
          // Si un groupe est trouvé, deuxième appel à l'API
          const tempIdClasse = reponseIdClasse.data.id_groupe;
          setIdClasse(tempIdClasse);
  
          const reponseClasse = await api.get(`/groupe/${tempIdClasse}`);
          setClasse(reponseClasse.data);
          setLoadingClasse(false);
        } catch (error) {
          setLoadingClasse(false); //Indique que le chargement est fini
        }
      };
  
      fetchClasse(decodedToken.sub);
    }
  }, [decodedToken]);
  

  // Modals states and handlers
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [isLeaveOpen, setIsLeaveOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  return (
    <VerifConnection>
      {connected ? (
        idClasse ? (
          <main className={style.pageClasse}>
            {loadingClasse ? (
              <Loading />
            ) : (
              <>
                <div className={style.classegauche}>
                  <div className={style.classe}>
                    <h2>{classe.nom_groupe}</h2>
                    <h3>Description: {classe.description_groupe}</h3>
                    <h3>Code pour rejoindre la classe: <strong style={{ color: 'red' }}>{idClasse}</strong></h3>
                  </div>
                  <button className={style.btnajouter} onClick={() => setIsAddOpen(true)}>Ajouter un élève</button>
                  <button onClick={() => setIsLeaveOpen(true)}>Quitter la classe</button>
                </div>
                <Modal show={isLeaveOpen} onClose={() => setIsLeaveOpen(false)}>
                  <QuitterClasse pseudo_utilisateur={decodedToken.sub} id_groupe={idClasse} />
                  <button onClick={() => setIsLeaveOpen(false)}>Annuler</button>
                </Modal>
                <Modal show={isAddOpen} onClose={() => setIsAddOpen(false)}>
                  <AjouterEleve id_groupe={idClasse} />
                  <button onClick={() => setIsAddOpen(false)}>Annuler</button>
                </Modal>
              </>
            )}
            <Chat class_id={idClasse} utilisateur={decodedToken.sub} />
            <MembresClasse idClasse={idClasse}/>
          </main>
        ) : (
          <main className={style.pageClasse}>
            <Modal show={isJoinOpen} onClose={() => setIsJoinOpen(false)}>
              <RejoindreClasse pseudo_utilisateur={decodedToken.sub} />
              <button onClick={() => setIsJoinOpen(false)}>Annuler</button>
            </Modal>
            <Modal show={isCreateOpen} onClose={() => setIsCreateOpen(false)}>
              <CreerClasse pseudo_utilisateur={decodedToken.sub} />
              <button onClick={() => setIsCreateOpen(false)}>Annuler</button>
            </Modal>
            <h1>Vous ne faites pas partie d'une classe !</h1>
            <button onClick={() => setIsJoinOpen(true)}>Rejoindre une classe</button>
            <p>ou</p>
            <button onClick={() => setIsCreateOpen(true)}>Créer votre propre classe</button>
          </main>
        )
      ) : (
        <main>
          <h1>Vous devez être connecté pour accéder à votre classe</h1>
          <Link to="/compte">Se connecter !</Link>
        </main>
      )}
    </VerifConnection>
  );
}
