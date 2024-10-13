import { Link } from "react-router-dom";

import style from "../style/Footer.module.css";

import logo from "../img/superSympa.png";

export default function Footer() {
    return (
        <div className={style.footer}>
            <a href="https://univ-lyon1.fr">
                <img src={logo} alt="logo" className={style.logo} />
            </a>
            <Link to="/">Qui sommes-nous ?</Link>
            <p>License Apache2.0</p>
            <a href="https://www.github.com/orgs/team-maitrobe/didactypo">
                <img src={logo} alt="logo" className={style.logo} />
            </a>
        </div>
    )
}