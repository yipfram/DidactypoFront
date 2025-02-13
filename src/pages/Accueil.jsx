import { Link } from "react-router-dom";

import style from "../style/Accueil.module.css";
import Leaderboard from "../elements/Defis/Defis";


export default function Accueil() {
 return (
    <main className={style.accueil}>
       <div className={style.accueilmenu}>
            <div className={style.texteaccueil}>
                <p>Bienvenue sur Didactypo ! <br/>
                Ici tu peux apprendre à mieux utiliser ton clavier et te mesurer aux autres en t'amusant !
                </p>
            </div>
            <div className={style.choixboutons}>
               <Link to="./compte" className={style.bouton}>Se connecter</Link>
               <Link to="./apprendre" className={style.bouton}>Apprendre</Link>
               <Link to="./competition" className={style.bouton}>Compétition</Link>
            </div>
       </div>
       <div className={style.leaderboard}>
          <Leaderboard/>
       </div>
    </main>
 )
}