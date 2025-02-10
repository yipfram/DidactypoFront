import { api } from '../../api';
import { Link } from "react-router-dom";
import { useRef, useState } from "react";

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

    // Manually create the x-www-form-urlencoded data
    const formData = new URLSearchParams();
    formData.append('username', inputPseudo.current.value);
    formData.append('password', inputMdp.current.value);

    // Send the data as application/x-www-form-urlencoded
    api.post("/token", formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    })
      .then(response => {
        window.localStorage.setItem("token", response.data.access_token);
        setIsLoading(false);
        window.location.href = `/profil/${inputPseudo.current.value}`;
      })
      .catch(err => {
        setIsLoading(false);
        if (err.response) {
          switch (err.response.status) {
            case 401:
              setErreur(err.response.data.detail || "Mot de passe ou pseudo incorrect");
              break;
            case 422:
              setErreur(`Mauvaise syntaxe: ${err.response.data.detail || "Champ invalide"}`);
              break;
            case 404:
              setErreur("Erreur lors de la connexion");
              break;
            default:
              setErreur("Erreur lors de la connexion");
          }
        } else {
          setErreur("Erreur lors de la connexion");
        }
      });
  }

  return (
      <div>
        <h2>Connexion</h2>
        <p>
          Il faut être connecté pour accéder aux ressources de Didactypo.
        </p>
        <form onSubmit={onSubmitHandler}>
          <fieldset>
          <label>
            Pseudo
            <input type="text" ref={inputPseudo} required autoFocus={true}/>
          </label>
          </fieldset>
          <fieldset>
          <label>
            Mot de passe
            <input type={showPassword ? "text" : "password"} ref={inputMdp} required onKeyPress={onPasswordKeyPressHandler}/>
            <button type="button" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? "Cacher" : "Afficher"}
            </button>
          </label>
          </fieldset>
          
          <div>
            <input type="submit" value="Se connecter"/>
          </div>
          {erreur && <div>{erreur}</div>}
          {isLoading && !erreur && <span>Chargement...</span>}
          <p>Pas encore inscrit ? <Link to="/inscription">Créer un compte</Link></p>
        </form>
      </div>
  );
}
