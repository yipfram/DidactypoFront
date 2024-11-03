import { Link } from "react-router-dom";

import style from "../style/Accueil.module.css";


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
                <button>Se connecter</button>
                <button>Mode Apprentissage</button>
                <button>Mode Compétition</button>
            </div>
       </div>
       <div className={style.leaderboard}>
            <h2>Leaderboard :</h2>
            <table>
                <tr>
                  <th>Position</th>  
                  <th>Pseudo</th> 
                  <th>Temps</th>
                  <th>Fautes</th> 
                </tr>
                <tr>
                  <td>1er</td>  
                  <td>Jeremy</td> 
                  <td>1.00min</td>
                  <td>3</td> 
                </tr>
                
            </table>
       </div>
    </main>   
    </>
 )
}