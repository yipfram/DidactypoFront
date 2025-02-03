import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useLocation } from "react-router-dom";

import CoursFinis from "../elements/Stats/CoursFinis";
import Mpm from "../elements/Stats/Mpm";
import TempsDefi from "../elements/Stats/TempsDefi";

import Badges from "../elements/CompteUtilisateur/Badges";
import ChangementMdp from "../elements/CompteUtilisateur/ChangementMdp";

import style from "../style/Compte.module.css";
import VerifConnection from "../elements/CompteUtilisateur/VerifConnexion";

export default function Compte() {
  const [decodedToken, setDecodedToken] = useState(null);
  const [pseudo, setPseudo] = useState("");
  const [propreCompte, setPropreCompte] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const pseudoFromUrl = location.pathname.split("/").pop();
    setPseudo(pseudoFromUrl);

    const token = window.localStorage.getItem("token");
    if (token) {
      setDecodedToken(jwtDecode(token));
    }
  }, [location]);

  useEffect(() => {
    if (decodedToken && pseudo === decodedToken.sub) {
      setPropreCompte(true);
    } else {
      setPropreCompte(false);
    }
  }, [decodedToken, pseudo])

  const handleLogout = () => {
    // Efface le token dans le stockage local
    window.localStorage.removeItem("token");

    // Réinitialise l'état `decodedToken`
    setDecodedToken(null);
    window.location.href = "/";
  };


  return (
    <VerifConnection>
      {decodedToken ? (
        <div className={style.container}>
          {/* Header avec le message de bienvenue et le bouton de déconnexion */}
          <div className={style.header}>
            {propreCompte ? (
              <>
                <h1>Bienvenue {decodedToken.sub} !</h1>
                <ChangementMdp />
                <button onClick={handleLogout}>Se déconnecter</button>
              </>
            ) : (
              <h1>Profil de {pseudo}</h1>
            )}
          </div>

          {/* Section des graphiques */}
          <div className={style.stats}>
            <div className={style["graph-container"]}>
              <Mpm pseudo={pseudo} />
            </div>
            <div className={style["graph-container"]}>
              <TempsDefi pseudo={pseudo} />
            </div>
          </div>

          {/* Section des badges */}
          <div className={style.badges}>
            <Badges pseudo={pseudo} />
          </div>
        </div>
      ) : null}
    </VerifConnection>
  );
}