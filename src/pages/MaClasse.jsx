import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';

import { api, getPseudo } from '../api';

import Loading from '../elements/Components/Loading';
import VerifConnection from '../elements/CompteUtilisateur/VerifConnexion';
import Modal from '../elements/Components/Modal';
import QuitterClasse from '../elements/Classe/QuitterClasse';
import AjouterEleve from '../elements/Classe/AjouterEleve';

import style from "../style/MaClasse.module.css";

import Chat from '../elements/Chat/Chat';
import MembresClasse from '../elements/Classe/MembresClasse';
import CreerSupprExerciceClasse from '../elements/Classe/CreerSupprExerciceClasse';
import ExerciceClasse from '../elements/Classe/ExerciceClasse';

export default function MaClasse() {
  const { id } = useParams();
  const [pseudo, setPseudo] = useState(getPseudo());
  const [classe, setClasse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);
  const [isLeaveOpen, setIsLeaveOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setPseudo(getPseudo());

    if (!pseudo || !id) return;

    const fetchClasseData = async () => {
      try {
        const responseUserClasses = await api.get(`/membre_classes/${pseudo}`);

        const userClasses = responseUserClasses.data.map(c => c.id_groupe);

        if (userClasses.includes(Number(id))) {
          setIsMember(true);

          const responseClasse = await api.get(`/groupe/${id}`);
          setClasse(responseClasse.data);
        } else {
          setIsMember(false);
        }

        const responsAdmin = await api.get(`/admins_par_groupe/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
      });
        if (responsAdmin.data.some(admin => admin.pseudo === pseudo)) {
          setIsAdmin(true);
        }

      } catch (error) {
        console.error("❌ Erreur récupération classe:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClasseData();
  }, [id]);

  const checkAdminStatus = async () => {
    try {
      const response = await api.get(`/membre_est_admin/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setIsAdmin(response.data);
    } catch (error) {
      console.error("Erreur pendant la vérification de l&apos;admin :", error);
    }
  };

  useEffect(() => {

    if (isMember) {
      checkAdminStatus();
    }

  }, [isMember, id]);



  // Optimisation des fonctions de gestion des modals avec useCallback
  const handleOpenAdd = useCallback(() => setIsAddOpen(true), []);
  const handleCloseAdd = useCallback(() => setIsAddOpen(false), []);
  const handleOpenLeave = useCallback(() => setIsLeaveOpen(true), []);
  const handleCloseLeave = useCallback(() => setIsLeaveOpen(false), []);

  return (
    <VerifConnection>
      {pseudo ? (
        <main className={style.pageClasse}>
          {loading ? (
            <Loading />
          ) : isMember && classe ? (
            <>
            <div className={style.partieTop}>
              <div className={style.classegauche}>
                <div className={style.classe}>
                  <h2>{classe.nom_groupe}</h2>
                  <h3>Description: {classe.description_groupe}</h3>
                  <h3>Code pour rejoindre la classe: <strong style={{ color: 'red' }}>{id}</strong></h3>
                </div>
                {isAdmin && (
                  <button className='btngeneral' onClick={handleOpenAdd}>Ajouter un élève</button>
                )}
                {isAdmin && <CreerSupprExerciceClasse idClasse={id}/>}
                <button className={style.btnQuitter} onClick={handleOpenLeave}>Quitter la classe</button>
              </div>

              <Modal show={isLeaveOpen} onClose={handleCloseLeave}>
                <QuitterClasse pseudo_utilisateur={pseudo} id_groupe={id} />
                <button onClick={handleCloseLeave}>Annuler</button>
              </Modal>

              {isAdmin && (
                <Modal show={isAddOpen} onClose={handleCloseAdd}>
                  <AjouterEleve id_groupe={id} />
                  <button onClick={handleCloseAdd}>Annuler</button>
                </Modal>
              )}

              <Chat class_id={id} utilisateur={pseudo} />
              <MembresClasse idClasse={id} />
              
            </div>
            <ExerciceClasse idClasse={id} ></ExerciceClasse>

            </>
          ) : (
            !loading && (
              <main className={style.pageClasseNotJoined}>
                <h1>Vous n&apos;êtes pas membre de cette classe ou elle n&apos;existe pas.</h1>
                <Link to="/classe">Retour à l&apos;accueil</Link>
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
