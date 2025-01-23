import style from "../style/Apprendre.module.css";
import { Link } from "react-router-dom";
import VerifConnection from '../elements/CompteUtilisateur/VerifConnexion.jsx';


export default function Apprendre() {
  return (
    <>
    <VerifConnection>
      <main className={style.apprendre}>
        <div className={style.texteapprendre}>
          <p>Bienvenue dans le mode apprentissage, <br/>
            ici vous pourrez vous améliorer sur votre clavier en suivant nos cours <br/>
            et en faisant des exercices pour vous entrainer.</p>
        </div>
        <div className={style.choixboutons}>
          <Link to="/listeCours" className={style.boutonsCours}>Cours</Link>
          <Link to="/listeExercices" className={style.boutonsCours}>Exercices</Link>
        </div>
      </main>
    </VerifConnection>
    </>
  );
}