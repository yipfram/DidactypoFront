import { Link } from "react-router-dom";

import style from "../style/Header.module.css";

import logo from "../img/logoDidactypo.png";
import iconCompte from "../img/IconCompte.png";

export default function Header() {
    return (
        <div className={style.header}>
            <Link to="/">
                <img src={logo} alt="logo" className={style.logo}/>
            </Link>
            <nav>
                <Link to="/" className={style.box}>Accueil</Link>
                <Link to="apprendre" className={style.box}>Apprendre</Link>
                <Link to="competition" className={style.box}>Competition</Link>
                <Link to="maclasse" className={style.box}>Ma Classe</Link>
                <Link to="mesinformations" className={style.box}>Mes Informations</Link>
            </nav>
            <Link to="/seconnecter">
                <img src={iconCompte} alt="compte" className={style.iconCompte}/>
            </Link>
        </div>
    )
}