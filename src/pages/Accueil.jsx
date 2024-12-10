import { Link } from "react-router-dom";

import style from "../style/Accueil.module.css";
import Leaderboard from "../elements/Defis";


export default function Accueil() {
 return (
    <>
    <main className={style.accueil}>
       <div className={style.accueilmenu}>
            <div className={style.texteaccueil}>
                <p>Bienvenue sur Dydactypo ! <br/>
                Ici tu peux apprendre à mieux utiliser ton clavier et te mesurer aux autres en t amusant !
                </p>
            </div>
            <div className={style.choixboutons}>
               <Link to="./SeConnecter" className={style.bouton}>Se connecter</Link>
               <Link to="./Apprendre" className={style.bouton}>Apprendre</Link>
               <Link to="./Competition" className={style.bouton}>Compétition</Link>
            </div>
       </div>
       <div className={style.leaderboard}>
          <Leaderboard/>
       </div>
    </main>   
    </>
 )
}