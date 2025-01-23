import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

import CoursFinis from "../elements/Stats/CoursFinis";
import Mpm from "../elements/Stats/Mpm";
import TempsDefi from "../elements/Stats/TempsDefi";

import Badges from "../elements/CompteUtilisateur/Badges";
import ChangementMdp from "../elements/CompteUtilisateur/ChangementMdp";

import style from "../style/Compte.module.css";
import VerifConnection from "../elements/CompteUtilisateur/VerifConnexion";

export default function Compte() {
  const [decodedToken, setDecodedToken] = useState(null);
  
  useEffect(() => {
    const token = window.localStorage.getItem("token");
    if (token) {
      setDecodedToken(jwtDecode(token))
    };
  }, [])

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
            <h1>Bienvenue {decodedToken.sub} !</h1>
            <ChangementMdp />
            <button onClick={handleLogout}>Se déconnecter</button>
           
          </div>

          

          {/* Section des graphiques */}
          <div className={style.stats}>
            <div className={style["graph-container"]}>
              <Mpm pseudo={decodedToken.sub} />
            </div>
            <div className={style["graph-container"]}>
              <TempsDefi pseudo={decodedToken.sub} />
            </div>
          </div>

          {/* Section des badges */}
          <div className={style.badges}>
            <Badges pseudo={decodedToken.sub} />
          </div>
        </div>
      ) : null}
    </VerifConnection>
  );
}