import { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import { Link } from 'react-router-dom';

import api from '../api';

import Loading from '../elements/Loading';
import VerifConnection from '../elements/VerifConnexion';

import style from "../style/MaClasse.module.css";
import styleList from "../style/MaClasse.module.css";
import icone from "../img/IconCompte.png";

export default function MaClasse() {
  const [connected, setConnected] = useState(false);
  const [decodedToken, setDecodedToken] = useState(null);
  const [classe, setClasse] = useState(null);
  const [idClasse, setIdClasse] = useState(null);
  const [membres, setMembres] = useState([]);
  const [loadingClasse, setLoadingClasse] = useState(true);
  const [loadingMembres, setLoadingMembres] = useState(true);
  const [mounted, setMounted] = useState(false); // Track if component is mounted

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const token = window.localStorage.getItem("token");
      if (token !== null) {
        setConnected(true);
        console.log("Token:", token); // Log the token
        if (token) {
          try {
            const decoded = jwtDecode(token);
            console.log("Decoded token:", decoded); // Log the decoded token
            setDecodedToken(decoded);
          } catch (error) {
            console.error("Error decoding token", error);
          }
        }
      }
    }
  }, [mounted]);

  useEffect(() => {
    if (decodedToken) {
      console.log("Fetching class data for user:", decodedToken.sub); // Log when fetching class data
      fetchClasse(decodedToken.sub);
    }
  }, [decodedToken]);

  const fetchClasse = async (userId) => {
    try {
      console.log("Fetching class ID for user:", userId); // Log the user ID
      const reponseIdClasse = await api.get(`/membre_classe/${userId}`);
      const tempIdClasse = reponseIdClasse.data.id_groupe;
      console.log("Fetched class ID:", tempIdClasse); // Log the class ID
      setIdClasse(tempIdClasse);

      const reponseClasse = await api.get(`/groupe/${tempIdClasse}`);
      console.log("Fetched class data:", reponseClasse.data); // Log the class data
      setClasse(reponseClasse.data);
      setLoadingClasse(false);
    } catch (error) {
      console.error("Erreur lors de la récupération des infos de la classe :", error);
    }
  };

  useEffect(() => {
    if (idClasse !== null) {
      console.log("Class ID updated, fetching members for class:", idClasse); // Log when fetching members
      fetchMembreClasse(idClasse);
    }
  }, [idClasse]);

  const fetchMembreClasse = async (idClasse) => {
    try {
      console.log("Fetching members for class ID:", idClasse); // Log the class ID when fetching members
      const reponseMembreClasse = await api.get(`/membre_classe_par_groupe/${idClasse}`);
      console.log("Fetched members data:", reponseMembreClasse.data); // Log the members data
      setMembres(reponseMembreClasse.data);
      setLoadingMembres(false);
    } catch (error) {
      console.error("Erreur lors de la récupération des membres de la classe :", error);
    }
  };

  return (
    <VerifConnection>
      {connected ? (
        idClasse !== null ? (
          <main className={style.pageClasse}>
            {loadingClasse ? (
              <Loading />
            ) : (
              <div className={style.classegauche}>
                <div className={style.classe}>
                  <h2>{classe.nom_groupe} :</h2>
                  <p>Description:</p>
                  <h3>{classe.description_groupe}</h3>
                </div>
                <button className={style.btnajouter}>Ajouter un élève</button>
              </div>
            )}
            <div>
              <h2>Membres</h2>
              <ul className={styleList.listeEleve}>
                {loadingMembres ? (
                  <Loading />
                ) : membres.length > 0 ? (
                  membres.map((membre) => (
                    <li key={membre.pseudo} className={styleList.eleve}>
                      <span>
                        <img className={styleList.icone} src={icone} alt="icone" />
                      </span>
                      {membre.pseudo}
                    </li>
                  ))
                ) : (
                  <p>Aucun membre trouvé.</p>
                )}
              </ul>
            </div>
          </main>
        ) : (
          <main>
            <h1>Vous ne faites pas partie d'une classe ! </h1>
          </main>
        )
      ) : (
        <main>
          <h1>Vous devez être connecté pour accéder a votre classe</h1>
          <Link to="/compte">Se connecter !</Link>
        </main>
      )}


    </VerifConnection>
  );
}
