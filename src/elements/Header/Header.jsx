import { NavLink, Link } from "react-router-dom";
import { useState, useEffect } from "react";

import style from "./Header.module.css";

import logo from "../../img/logoDidactypo.png";
import iconCompte from "../../img/IconCompte.png";
import { getPseudo } from "../../api";

export default function Header() {
    const [pseudo, setPseudo] = useState("Se connecter");

    useEffect(() => {
        const pseudo = getPseudo();
        if (pseudo) {
            setPseudo(getPseudo());
        } else {
            setPseudo("Se connecter")
        }
    }, [])
    
    return (
        <div className={style.header}>
            <Link to="/">
                <img src={logo} alt="logo" className={style.logo}/>
            </Link>
            <nav>
                <NavLink to="/">Accueil</NavLink>
                <NavLink to="/apprendre">Apprendre</NavLink>
                <NavLink to="/competition">Competition</NavLink>
                <NavLink to="/classe">Ma Classe</NavLink>
                <NavLink to="/infos">Infos utiles</NavLink>
            </nav>
            <NavLink to={`/profil/${pseudo}`} className={({ isActive }) => isActive ? style.active : ""}>
                <p>{pseudo}</p>
                <img src={iconCompte} alt="compte" className={style.iconCompte}/>
            </NavLink>
        </div>  
    )
}