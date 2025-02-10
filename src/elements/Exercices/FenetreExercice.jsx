import style from "../../style/Apprendre.module.css";
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
