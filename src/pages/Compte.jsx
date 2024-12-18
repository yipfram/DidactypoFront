import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

import Stats from "../elements/Stats";
import Badges from "../elements/Badges";

import style from "../style/Compte.module.css";
import VerifConnection from "../elements/VerifConnexion";

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
        <>
          <h1>Bienvenue {decodedToken.sub} !</h1>
          <button onClick={handleLogout}>Se déconnecter</button>
          <div className={style.stats}>
            <Stats pseudo={decodedToken.sub} />
            <Badges pseudo={decodedToken.sub} />
          </div>
        </>
      ) : null}
    </VerifConnection>
  );
}
