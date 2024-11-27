import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <>
        <h1>Erreur 404, la page que vous cherchez n'existe pas.</h1>
        <Link to="/">Retour à l'accueil</Link>
        </>
    )
}