import style from "../../style/Apprendre.module.css";
import { useState, useEffect } from "react";
import api from "../../api";
import InterfaceSaisie from "../InterfaceSaisie/InterfaceSaisie";

export default function FenetreCours() {
    
    return (
        <>
            <div className={style.fenetreCours}>
                <InterfaceSaisie />
            </div>
        </>
    );
}
