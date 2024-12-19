import { NavLink, Link } from "react-router-dom";

import style from "./Header.module.css";

import logo from "../../img/logoDidactypo.png";
import iconCompte from "../../img/IconCompte.png";

export default function Header() {
    return (
        <div className={style.header}>
            <Link to="/">
                <img src={logo} alt="logo" className={style.logo}/>
            </Link>
            <nav>
                <NavLink to="/">Accueil</NavLink>
                <NavLink to="/apprendre">Apprendre</NavLink>
                <NavLink to="/competition">Competition</NavLink>
                <NavLink to="/maclasse">Ma Classe</NavLink>
                <NavLink to="/infos">Infos utiles</NavLink>
            </nav>
            <Link to="/compte">
                <img src={iconCompte} alt="compte" className={style.iconCompte}/>
            </Link>
        </div>
    )
}