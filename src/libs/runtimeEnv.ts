/**
 * Variables d'environnement publiques résolues à l'exécution.
 *
 * Next.js fige les `NEXT_PUBLIC_*` dans le bundle au moment du `next build` :
 * une même image Docker ne pourrait alors pas changer d'API ou de domaine selon
 * l'environnement. On lit donc `process.env` côté serveur (à chaque requête) et
 * `window.__ENV__` côté navigateur, injecté dans le HTML par <RuntimeEnvScript />.
 */

export type PublicRuntimeEnv = {
  /** Base des appels API, chemin inclus (ex: https://api.exemple.com/api/v1) */
  apiUrl: string

  /** URL publique du front, utilisée pour les redirections de déconnexion */
  appUrl?: string
}

declare global {
  interface Window {
    __ENV__?: PublicRuntimeEnv
  }
}

export const getPublicEnv = (): PublicRuntimeEnv => {
  if (typeof window !== 'undefined') {
    return window.__ENV__ ?? { apiUrl: '' }
  }

  return {
    apiUrl: process.env.API_URL ?? '',
    appUrl: process.env.APP_URL
  }
}
