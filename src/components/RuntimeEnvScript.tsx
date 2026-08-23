// Util Imports
import { getPublicEnv } from '@/libs/runtimeEnv'

/**
 * Expose les variables publiques au navigateur via `window.__ENV__`.
 *
 * Script inline classique : il s'exécute pendant l'analyse du HTML, donc avant
 * les bundles React (différés). Les layouts qui le montent sont rendus
 * dynamiquement, la valeur suit donc l'environnement du conteneur sans rebuild.
 */
const RuntimeEnvScript = () => {
  // Échappe `<` pour qu'une valeur ne puisse pas fermer la balise <script>.
  const json = JSON.stringify(getPublicEnv()).replace(/</g, '\u003c')

  return <script id='__ENV__' dangerouslySetInnerHTML={{ __html: `window.__ENV__=${json}` }} />
}

export default RuntimeEnvScript
