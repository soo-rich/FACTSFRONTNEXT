import type { TreeStatsProps } from './types'

export const TreeStats = ({ stats, onClose }: TreeStatsProps) => {
    return (
        <div className="bg-white dark:bg-gray-800 shadow-xl p-6 rounded-lg border border-gray-200 dark:border-gray-700 min-w-[300px]">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <i className="tabler-chart-bar text-cyan-600 dark:text-cyan-400" />
                    Statistiques
                </h3>
                <button
                    onClick={onClose}
                    className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                    <i className="tabler-x text-xl" />
                </button>
            </div>

            <div className="space-y-3 text-sm">
                <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <span className="text-gray-600 dark:text-gray-400">Total nœuds:</span>
                    <span className="font-bold text-gray-900 dark:text-gray-100">{stats.total}</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <span className="text-gray-600 dark:text-gray-400">Profondeur max:</span>
                    <span className="font-bold text-gray-900 dark:text-gray-100">{stats.maxDepth}</span>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                    <div className="text-gray-700 dark:text-gray-300 font-semibold mb-2">Par type:</div>
                    {Object.entries(stats.byType).map(([type, count]) => (
                        <div key={type} className="flex justify-between items-center mb-2">
                            <span className="text-xs text-gray-600 dark:text-gray-400">{type}</span>
                            <div className="flex items-center gap-2">
                                <div className="w-20 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
                                        style={{ width: `${((count / stats.total) * 100)}%` }}
                                    />
                                </div>
                                <span className="text-xs font-semibold text-gray-900 dark:text-gray-100 w-6 text-right">{count}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {stats.adopted > 0 && (
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                        <div className="text-gray-700 dark:text-gray-300 font-semibold mb-2">Adoption:</div>
                        <div className="flex justify-between text-xs">
                            <div className="flex items-center gap-1">
                                <i className="tabler-check text-green-500 dark:text-green-400" />
                                <span className="text-gray-600 dark:text-gray-400">Adoptés:</span>
                                <span className="font-semibold text-green-600 dark:text-green-400">{stats.adopted}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <i className="tabler-x text-red-500 dark:text-red-400" />
                                <span className="text-gray-600 dark:text-gray-400">Non adoptés:</span>
                                <span className="font-semibold text-red-600 dark:text-red-400">{stats.notAdopted}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
