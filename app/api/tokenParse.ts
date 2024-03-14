import jwt from 'jsonwebtoken'
import type {NextApiRequest} from "next";

// Fonction pour décoder le token JWT
function decodeToken(token: string) {
    try {
        // Remplacez 'YOUR_SECRET_KEY' par la clé secrète utilisée pour signer le token JWT
        const decoded = jwt.verify(token, 'JSvma1X5Gt')
        return decoded
    } catch (error) {
        // En cas d'erreur (par exemple, token expiré), renvoyer null
        return null
    }
}

// This function can be marked `async` if using `await` inside
export function tokenParse(request: any): any | null {
    // Récupérer le token depuis les headers de la requête
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')

    if (token) {
        // Décoder le token
        const decodedToken = decodeToken(token)

        if (decodedToken) {

            // Continuer vers la prochaine étape du middleware
            return decodedToken
        } else {
            // Si le token est expiré ou invalide, renvoyer une réponse 401 Unauthorized
            return null;
        }
    } else {
        // Si aucun token n'est présent dans les headers, renvoyer une réponse 401 Unauthorized
        return null;
    }
}