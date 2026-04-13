import type { DriveStep } from 'driver.js'

export function getTourSteps(): DriveStep[] {
  return [
    {
      element: '.ts-vertical-nav-root',
      popover: {
        title: 'Navigation principale',
        description: 'Le menu latéral vous donne accès à toutes les sections de l\'application. Vous pouvez le réduire ou l\'agrandir selon vos besoins.',
        side: 'right',
        align: 'start'
      }
    },
    {
      element: 'a[href*="dashboard"]',
      popover: {
        title: 'Dashboard',
        description: 'Consultez vos indicateurs clés — chiffre d\'affaires, graphiques et tableaux récapitulatifs en un seul endroit.',
        side: 'right',
        align: 'center'
      }
    },
    {
      element: 'a[href*="proforma"]',
      popover: {
        title: 'Dossiers',
        description: 'Créez et gérez vos proformas, bons de commande, bons de livraison et factures depuis cette section.',
        side: 'right',
        align: 'center'
      }
    },
    {
      element: '#tour-search',
      popover: {
        title: 'Recherche globale',
        description: 'Accédez instantanément à n\'importe quelle ressource de l\'application grâce à la recherche globale.',
        side: 'bottom',
        align: 'start'
      }
    },
    {
      element: '#tour-notifications',
      popover: {
        title: 'Notifications',
        description: 'Retrouvez ici toutes vos alertes et notifications en temps réel.',
        side: 'bottom',
        align: 'end'
      }
    },
    {
      element: '#tour-mode',
      popover: {
        title: 'Mode d\'affichage',
        description: 'Basculez entre le mode clair, sombre ou système selon vos préférences.',
        side: 'bottom',
        align: 'end'
      }
    },
    {
      element: '#tour-user',
      popover: {
        title: 'Votre profil',
        description: 'Accédez à votre profil, vos paramètres, et relancez ce tour à tout moment depuis ce menu.',
        side: 'bottom',
        align: 'end'
      }
    }
  ]
}
