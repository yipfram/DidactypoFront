import urlApi from "../../utils/urlApi";
import Modal from "../Modal/Modal";
import { useContext, useRef, useState } from "react";

export default function ModalConnexion(props) {
  const [erreur, setErreur] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const inputPseudo = useRef();
  const inputMdp = useRef();

  const lang = useContext(LanguageContext).lang;

  function onClose() {
    if(!props.onClose) {
      window.location.reload();
    } else {
      props.onClose();
    }
  }

  function onCancel() {
    if(!props.onCancel) {
      onClose();
    } else {
      props.onCancel();
    }
  }

  function toggleShowPassword(e) {
    e.preventDefault();
    setShowPassword(!showPassword);
  }

  function onPasswordKeyPressHandler(e) {
    if (e.key === 'Enter') {
      onSubmitHandler(e);
    }
  }

  function onSubmitHandler(e) {
    e.preventDefault();
    setIsLoading(true);
    setErreur(null);
    const formData = {
      "username": inputPseudo.current.value,
      "password": inputMdp.current.value
    }

    fetch(urlApi+"/token", {
      method: "POST",
      mode: "cors",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify(formData)
    })
    .then(response => {
      response.json()
      .then(data => {
        switch(response.status) {
          case 200: window.localStorage.setItem("token", data.token); onClose(); break;
          case 401: setErreur(data.error); break;
          case 422: setErreur(`Mauvaise syntaxe: ${data.detail[0].loc[1]}`); break;
          case 404: setErreur("Erreur lors de la connexion"); break;
          default: setErreur("Erreur lors de l'inscription");
        }
      });
    })
    .catch(() => {setErreur("Erreur lors de l'inscription"); setIsLoading(false)})
  }

  return (
    <Modal onClose={onCancel}>
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
            <div>
              <input onKeyDown={onPasswordKeyPressHandler} type={showPassword ? 'text' : 'password'} ref={inputMdp} required/>
              <i className={`fa-regular ${ showPassword?'fa-eye-slash':'fa-eye'} h-5.5 w-5.5  my-2 flex absolute end-4`} onClick={toggleShowPassword} ></i>
            </div>
          </label>
          <div>
            <input type="submit" value="Se connecter"/>
            <input type="button" onClick={onCancel} value="Annuler"/>
          </div>
          {erreur && <div>{erreur}</div>}
          {isLoading && !erreur && <span></span>}
          <p>Pas encore inscrit ? <Link to="/inscription" >Créer un compte</Link></p>
        </form>
      </div>
    </Modal>
  )
}