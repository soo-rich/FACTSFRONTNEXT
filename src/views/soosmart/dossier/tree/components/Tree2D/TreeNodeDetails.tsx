import type { TreeNodeDetailsProps } from './types'
import { getNodeColor } from './utils'

export const TreeNodeDetails = ({ node, onClose }: TreeNodeDetailsProps) => {
    const color = getNodeColor(node.type).replace('bg-gradient-to-br', 'bg-gradient-to-r')

    return (
        <div className={`${color} text-white p-6 rounded-lg shadow-xl border-2 border-white/20 max-w-md backdrop-blur-sm`}>
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">{node.type}</h3>
                <button
                    onClick={onClose}
                    className="text-white/70 hover:text-white transition-colors"
                >
                    <i className="tabler-x text-xl" />
                </button>
            </div>

            <div className="space-y-3">
                {node.numero && (
                    <div className="bg-white/10 p-3 rounded">
                        <div className="text-white/70 text-xs mb-1">Numéro</div>
                        <div className="font-semibold text-lg">{node.numero}</div>
                    </div>
                )}

                {node.reference && (
                    <div className="bg-white/10 p-3 rounded">
                        <div className="text-white/70 text-xs mb-1">Référence</div>
                        <div className="font-medium">{node.reference}</div>
                    </div>
                )}

                <div className="bg-white/10 p-3 rounded">
                    <div className="text-white/70 text-xs mb-1">Enfants</div>
                    <div className="font-semibold">{node.children?.length || 0}</div>
                </div>

                {node.adopt !== null && (
                    <div className="bg-white/10 p-3 rounded">
                        <div className="text-white/70 text-xs mb-1">Statut d&apos;adoption</div>
                        <div className="flex items-center gap-2">
                            <div
                                className={`w-3 h-3 rounded-full ${node.adopt ? 'bg-green-400' : 'bg-red-400'}`}
                            />
                            <span className="font-semibold">{node.adopt ? 'Adopté' : 'Non adopté'}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
