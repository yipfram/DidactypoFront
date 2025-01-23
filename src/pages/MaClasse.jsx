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

  // Fetch class details for the logged-in user
  useEffect(() => {
    if (decodedToken) {
      const fetchClasse = async (userId) => {
        try {
          const reponseIdClasse = await api.get(`/membre_classe/${userId}`);
          const tempIdClasse = reponseIdClasse.data.id_groupe;
          setIdClasse(tempIdClasse);

          const reponseClasse = await api.get(`/groupe/${tempIdClasse}`);
          setClasse(reponseClasse.data);
          setLoadingClasse(false);
        } catch (error) {
          console.error("Erreur lors de la récupération des infos de la classe :", error);
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
                  <button className={style.btnQuitter} onClick={() => setIsLeaveOpen(true)}>Quitter la classe</button>
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
          <main className={style.pageClasseNotJoined}>
            <h1>Vous ne faites pas partie d'une classe !</h1>
            <h3>Rejoindre une classe ou créer la vôtre pour commencer !</h3>

            <div className={style.buttonsContainerNotJoined}>
              <button className={style.btnNotJoined} onClick={() => setIsJoinOpen(true)}>Rejoindre une classe</button>
              <h3>ou</h3>
              <button className={style.btnNotJoined} onClick={() => setIsCreateOpen(true)}>Créer votre propre classe</button>
            </div>

            <h3>Ici, tu peux rejoindre une classe afin de pouvoir discuter avec tes camarades, et consulter qui est dans ta classe !</h3>

            <Modal show={isJoinOpen} onClose={() => setIsJoinOpen(false)}>
              <RejoindreClasse pseudo_utilisateur={decodedToken.sub} />
              <button onClick={() => setIsJoinOpen(false)}>Annuler</button>
            </Modal>

            <Modal show={isCreateOpen} onClose={() => setIsCreateOpen(false)}>
              <CreerClasse pseudo_utilisateur={decodedToken.sub} />
              <button onClick={() => setIsCreateOpen(false)}>Annuler</button>
            </Modal>
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
