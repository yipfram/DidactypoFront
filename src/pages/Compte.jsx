import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { getPseudo } from "../api";

import CoursFinis from "../elements/Stats/CoursFinis";
import Mpm from "../elements/Stats/Mpm";
import TempsDefi from "../elements/Stats/TempsDefi";

import Badges from "../elements/CompteUtilisateur/Badges";
import ChangementMdp from "../elements/CompteUtilisateur/ChangementMdp";

import style from "../style/Compte.module.css";
import VerifConnection from "../elements/CompteUtilisateur/VerifConnexion";

export default function Compte() {
  const [pseudoToken, setPseudoToken] = useState(getPseudo());
  const { pseudo } = useParams();
  const [propreCompte, setPropreCompte] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const pseudoFromUrl = location.pathname.split("/").pop();

    setPseudoToken(getPseudo());

  }, [location]);

  useEffect(() => {
    if (pseudo === pseudoToken) {
      setPropreCompte(true);
    } else {
      setPropreCompte(false);
    }
  }, [pseudoToken, pseudo])

  const handleLogout = () => {
    // Efface le token dans le stockage local
    window.localStorage.removeItem("token");

    setPseudoToken(null);
    window.location.href = "/";
  };


  return (
    <VerifConnection>
      {pseudoToken ? (
        <div className={style.container}>
          {/* Header avec le message de bienvenue et le bouton de déconnexion */}
          <div className={style.header}>
            {propreCompte ? (
              <>
                <h1>Bienvenue {pseudoToken} !</h1>
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