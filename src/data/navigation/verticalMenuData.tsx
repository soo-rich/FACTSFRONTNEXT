// Type Imports
import type {VerticalMenuDataType} from '@/types/menuTypes'
import type {getDictionary} from '@/utils/getDictionary'

const verticalMenuData = (dictionary: Awaited<ReturnType<typeof getDictionary>>): VerticalMenuDataType[] => [
  // This is how you will normally render submenu
  {
    label: dictionary['navigation'].dashboard,
    href: '/dashboard',
    icon: 'tabler-smart-home',

  },
  {
    label: dictionary['navigation'].dossier,
    isSection: true,
    children: [
      {
        label: dictionary['navigation'].invoice,
        href: '/dossier',
        icon: 'tabler-file-description'
      },
    ]
  },
  {
    label: dictionary['navigation'].cl_pr,
    isSection:true,
    children:[
      {
        label: "Projet",
        href: "/projet",
        icon: 'tabler-clipboard-list',
      },
      {
        label: "Client",
        href: "/client",
        icon: 'tabler-users',
      },
    ]
  },
  {
    label: dictionary['navigation'].others,
    isSection: true,
    children: [
      {
        label: dictionary['navigation'].article,
        href: '/article',
        icon: 'tabler-tags'
      },
      {
        label: dictionary['navigation'].user,
        icon: 'tabler-user',
        href: '/user',

      },
      {
        label: dictionary['navigation'].settings,
        icon: 'tabler-settings',
        href: '/profile',

      },
    ]
  },
]

export default verticalMenuData
