import { NavLink, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";

import style from "./Header.module.css";

import logo from "../../img/logoDidactypo.png";
import iconCompte from "../../img/IconCompte.png";

export default function Header() {
    const [pseudo, setPseudo] = useState("Se connecter");

    useEffect(() => {
        const token = window.localStorage.getItem("token");
        if (token) {
            const decoded = jwtDecode(token);
            setPseudo(decoded.sub);
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
            <Link to={`/profil/${pseudo}`}>
                <p>{pseudo}</p>
                <img src={iconCompte} alt="compte" className={style.iconCompte}/>
            </Link>
        </div>  
    )
}