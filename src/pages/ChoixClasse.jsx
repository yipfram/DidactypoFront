import { useEffect, useState } from "react";
import { api, getPseudo } from "../api";

import Loading from "../elements/Components/Loading";
import VerifConnexion from "../elements/CompteUtilisateur/VerifConnexion";
import Modal from "../elements/Components/Modal";
import CreerClasse from "../elements/Classe/CreerClasse";
import RejoindreClasse from "../elements/Classe/RejoindreClasse";

import style from "../style/MaClasse.module.css";

export default function ChoixClasse() {
    const [pseudo, setPseudo] = useState(getPseudo());
    const [classes, setClasses] = useState([]);
    const [loadingClasses, setLoadingClasses] = useState(false);
    const [error, setError] = useState(null);

    const [isJoinOpen, setIsJoinOpen] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    useEffect(() => {
        setPseudo(getPseudo());
        fetchClasses(pseudo);
    }, []);

    const fetchClasses = async (pseudo_utilisateur) => {
        setLoadingClasses(true);
        setError(null);

        try {
            const responseIdClasses = await api.get(`/membre_classes/${pseudo_utilisateur}`);

            if (responseIdClasses.status === 204 || responseIdClasses.data.length === 0) {
                setClasses([]);
                return;
            }

            const tempIdClasses = responseIdClasses.data.map(item => item.id_groupe);

            const classesDetails = await Promise.allSettled(
                tempIdClasses.map(id => api.get(`/groupe/${id}`))
            );

            setClasses(classesDetails
                .filter(result => result.status === "fulfilled" && result.value?.data)
                .map(result => result.value.data));

        } catch (error) {
            console.error("Erreur de récupération des classes:", error);
            setError("Échec de la récupération des classes. Veuillez réessayer plus tard.");
        } finally {
            setLoadingClasses(false);
        }
    };

    return (
        <VerifConnexion>
            <main className={style.pageClasseNotJoined}>
                <h1>Choisissez votre classe</h1>

                {loadingClasses ? (
                    <Loading />
                ) : classes.length > 0 ? (
                    <ul className={style.classesList}>
                        {classes.map(classe => (
                            <li key={classe.id_groupe} onClick={() => {window.location.href = `/classe/${classe.id_groupe}`}}>
                                <h2>{classe.nom_groupe}</h2>
                                <p>{classe.description_groupe}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <>
                        <h1>Vous ne faites pas partie d'une classe !</h1>
                        <h3>Rejoindre une classe ou créer la vôtre pour commencer !</h3>
                    </>
                )}


                <div className={style.buttonsContainerNotJoined}>
                    <button className={style.btnNotJoined} onClick={() => setIsJoinOpen(true)}>Rejoindre une classe</button>
                    <h3>ou</h3>
                    <button className={style.btnNotJoined} onClick={() => setIsCreateOpen(true)}>Créer votre propre classe</button>
                </div>

                <h3>
                    Ici, tu peux rejoindre une classe afin de pouvoir discuter avec tes
                    camarades, et consulter qui est dans ta classe !
                </h3>

                {error && <p className={style.error}>{error}</p>}

                <Modal show={isJoinOpen} onClose={() => setIsJoinOpen(false)}>
                    <RejoindreClasse pseudo_utilisateur={pseudo} />
                    <button onClick={() => setIsJoinOpen(false)}>Annuler</button>
                </Modal>

                <Modal show={isCreateOpen} onClose={() => setIsCreateOpen(false)}>
                    <CreerClasse pseudo_utilisateur={pseudo} />
                    <button onClick={() => setIsCreateOpen(false)}>Annuler</button>
                </Modal>
            </main>
        </VerifConnexion>
    );
}
