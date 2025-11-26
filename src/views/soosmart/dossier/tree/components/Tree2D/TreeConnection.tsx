import type { TreeConnectionProps } from './types'

export const TreeConnection = ({ from, to }: TreeConnectionProps) => {
    const startX = from.x
    const startY = from.y + 40 // Offset pour partir du bas de la carte
    const endX = to.x
    const endY = to.y - 40 // Offset pour arriver en haut de la carte

    // Créer une courbe de Bézier pour une connexion plus élégante
    const controlY = startY + (endY - startY) / 2

    return (
        <svg
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            style={{ zIndex: 1 }}
        >
            <defs>
                <linearGradient id={`gradient-${from.node.id}-${to.node.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.6" />
                </linearGradient>
            </defs>
            <path
                d={`M ${startX} ${startY} C ${startX} ${controlY}, ${endX} ${controlY}, ${endX} ${endY}`}
                fill="none"
                stroke={`url(#gradient-${from.node.id}-${to.node.id})`}
                strokeWidth="2"
                strokeLinecap="round"
                className="transition-all duration-300"
            />
            {/* Point de départ */}
            <circle cx={startX} cy={startY} r="4" fill="#06b6d4" opacity="0.8" />
            {/* Point d'arrivée */}
            <circle cx={endX} cy={endY} r="4" fill="#8b5cf6" opacity="0.8" />
        </svg>
    )
}
