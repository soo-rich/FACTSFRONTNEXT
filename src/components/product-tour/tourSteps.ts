import type { DriveStep } from 'driver.js'

export function getTourSteps(): DriveStep[] {
  return [
    {
      element: '.ts-vertical-nav-container',
      popover: {
        title: 'Navigation principale',
        description:
          "Le menu latéral vous donne accès à toutes les sections de l'application. Vous pouvez le réduire ou l'agrandir selon vos besoins.",
        side: 'right',
        align: 'start'
      }
    },
    {
      element: 'a[href*="dashboard"]',
      popover: {
        title: 'Dashboard',
        description:
          "Consultez vos indicateurs clés — chiffre d'affaires, graphiques et tableaux récapitulatifs en un seul endroit.",
        side: 'right',
        align: 'center'
      }
    },
    {
      element: '#dossier',
      popover: {
        title: 'Dossiers',
        description:
          'Créez et gérez vos proformas, bons de commande, bons de livraison et factures depuis cette section.',
        side: 'right',
        align: 'center'
      }
    },
    {
      element: '#tour-search',
      popover: {
        title: 'Recherche globale',
        description: "Accédez instantanément a n'import quel documents Documents.",
        side: 'bottom',
        align: 'start'
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
