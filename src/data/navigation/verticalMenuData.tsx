// Type Imports
import type { VerticalMenuDataType } from '@/types/menuTypes'
import type { getDictionary } from '@/utils/getDictionary'

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
        label: dictionary['navigation'].dossier,
        icon: 'tabler-file-description',
        children: [
          {
            label: dictionary['navigation'].case.proforma,
            href: '/proforma',
          }, {
            label: dictionary['navigation'].case.purchase_order,
            href: '/purchase_order',
          }, {
            label: dictionary['navigation'].case.order_slip,
            href: '/order_slip',
          }, {
            label: dictionary['navigation'].invoice,
            href: '/invoice',
          },
        ]
      },
    ]
  },
  {
    label: dictionary['navigation'].cl_pr,
    isSection: true,
    children: [
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
        label: dictionary['navigation'].profile,
        icon: 'tabler-settings',
        href: '/profile',

      },
    ]
  },
]

export default verticalMenuData
