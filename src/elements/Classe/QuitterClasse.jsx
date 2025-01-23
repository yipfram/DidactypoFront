import api from "../../api";

const QuitterClasse = (props) => {
    const handleSubmit = async (event) => {
        event.preventDefault();
        const { id_groupe, pseudo_utilisateur } = props;  // Destructure directly from props

        try {
            // Pass params correctly as part of the config object in the third argument
            const response = await api.delete('/membres_classe', {
                params: {
                    id_groupe: id_groupe,
                    pseudo_utilisateur: pseudo_utilisateur
                }
            });
            window.location.reload();
        } catch (error) {
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>Êtes-vous sûr de quitter cette classe ?</h1>
            <p>Vous pourrez rejoindre cette classe à tout moment avec l'authorisation d'un administrateur de la classe.</p>
            <button type="submit">Quitter la classe</button>
        </form>
    );
}

export default QuitterClasse;
