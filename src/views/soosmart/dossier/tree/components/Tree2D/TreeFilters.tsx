import type { TreeFiltersProps } from './types'

export const TreeFilters = ({
    searchQuery,
    filterType,
    showStats,
    onSearchChange,
    onFilterChange,
    onToggleStats
}: TreeFiltersProps) => {
    return (
        <div className="flex flex-col gap-2 bg-white dark:bg-gray-800 shadow-lg p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <i className="tabler-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                    <input
                        type="text"
                        placeholder="Rechercher (numéro, référence, type)..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-800 outline-none text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    />
                </div>
                <button
                    onClick={onToggleStats}
                    className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${showStats
                        ? 'bg-purple-600 text-white hover:bg-purple-700'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                    title="Statistiques"
                >
                    <i className="tabler-chart-bar" />
                </button>
            </div>

            <select
                value={filterType}
                onChange={(e) => onFilterChange(e.target.value as any)}
                className="px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-800 outline-none text-sm"
            >
                <option value="ALL">Tous les types</option>
                <option value="FACTURE">Factures</option>
                <option value="BORDEREAU">Bordereaux</option>
                <option value="BON_DE_COMMANDE">Bons de commande</option>
                <option value="PROFORMA">Proformas</option>
            </select>
        </div>
    )
}
