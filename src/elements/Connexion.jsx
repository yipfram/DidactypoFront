import urlApi from "../../utils/urlApi";
import { Link } from "react-router-dom";
import { useContext, useRef, useState } from "react";

export default function Connexion(props) {
  const [erreur, setErreur] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const inputPseudo = useRef();
  const inputMdp = useRef();


  function onPasswordKeyPressHandler(e) {
    if (e.key === 'Enter') {
      onSubmitHandler(e);
    }
  }

  function onSubmitHandler(e) {
    e.preventDefault();
    setIsLoading(true);
    setErreur(null);
  
    const formData = new URLSearchParams();
    formData.append('username', inputPseudo.current.value);
    formData.append('password', inputMdp.current.value);
  
    fetch(urlApi + "/token", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        switch (response.status) {
          case 200:
            window.localStorage.setItem("token", data.token);
            onClose();
            break;
          case 401:
            setErreur(data.detail || "Mot de passe ou pseudo incorrect");
            break;
          case 422:
            setErreur(`Mauvaise syntaxe: ${data.detail?.[0]?.loc[1] || "Champ invalide"}`);
            break;
          case 404:
            setErreur("Erreur lors de la connexion");
            break;
          default:
            setErreur("Erreur lors de l'inscription");
        }
        setIsLoading(false);
      })
      .catch(() => {
        setErreur("Erreur lors de l'inscription");
        setIsLoading(false);
      });
  }
  

  return (
      <div>
        <h2>Connexion</h2>
        <p>
          Il faut être connecté pour accéder aux ressources de Didactypo.
        </p>
        <form onSubmit={onSubmitHandler}>
          <label>
            Pseudo
            <input type="text" ref={inputPseudo} required autoFocus={true}/>
          </label>
          <label>
            Mot de passe
            <input type={showPassword ? "text" : "password"} ref={inputMdp} required onKeyPress={onPasswordKeyPressHandler}/>
            <button type="button" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? "Cacher" : "Afficher"}
            </button>
          </label>
          <div>
            <input type="submit" value="Se connecter"/>
          </div>
          {erreur && <div>{erreur}</div>}
          {isLoading && !erreur && <span></span>}
          <p>Pas encore inscrit ? <Link to="/inscription">Créer un compte</Link></p>
        </form>
      </div>
  )
}