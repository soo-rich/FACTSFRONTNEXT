// hooks/usePrint.ts
import { useCallback } from 'react';

import themeConfig from '@configs/themeConfig'

interface PrintOptions {
  title?: string;
  styles?: string;
  onBeforePrint?: () => void;
  onAfterPrint?: () => void;
}

const usePrint = () => {
  const printComponent = useCallback((elementId: string, options: PrintOptions = {}) => {
    const {
      title = themeConfig.templateName,
      styles = '',
      onBeforePrint,
      onAfterPrint
    } = options;

    // Trouve l'élément à imprimer
    const printContent = document.getElementById(elementId);

    if (!printContent) {
      console.error(`Élément avec l'ID "${elementId}" non trouvé`);

return;
    }

    // Callback avant impression
    onBeforePrint?.();

    // Clone le contenu pour éviter les modifications
    const clonedContent = printContent.cloneNode(true) as HTMLElement;

    // Collecte tous les styles de la page
    const collectStyles = (): string => {
      let stylesContent = '';

      // Styles intégrés dans le document
      const styleElements = document.querySelectorAll('style');

      styleElements.forEach(style => {
        stylesContent += style.innerHTML;
      });

      // Styles des feuilles CSS externes et internes
      try {
        Array.from(document.styleSheets).forEach(styleSheet => {
          try {
            // Pour les feuilles CSS accessibles
            if (styleSheet.cssRules) {
              Array.from(styleSheet.cssRules).forEach(rule => {
                stylesContent += rule.cssText + '\n';
              });
            }
          } catch (e) {
            // Pour les feuilles CSS externes (CORS), on ajoute le lien
            if (styleSheet.href) {
              stylesContent += `@import url("${styleSheet.href}");\n`;
            }
          }
        });
      } catch (e) {
        console.warn('Impossible de récupérer certains styles:', e);
      }

      return stylesContent + styles;
    };

    // Crée une nouvelle fenêtre pour l'impression
    const printWindow = window.open('', '_blank', 'width=800,height=600');

    if (!printWindow) {
      alert('Impossible d\'ouvrir la fenêtre d\'impression. Vérifiez que les pop-ups ne sont pas bloquées.');

return;
    }

    // Construit le HTML de la fenêtre d'impression
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${title}</title>
          <style>
            /* Reset de base pour l'impression */
            * {
              box-sizing: border-box;
            }

            body {
              margin: 0;
              padding: 20px;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.5;
              color: #000;
              background: #fff;
            }

            /* Styles pour l'impression */
            @media print {
              body {
                margin: 0;
                padding: 0;
                -webkit-print-color-adjust: exact;
                color-adjust: exact;
              }

              @page {
                margin: 0.5in;
              }
            }

            /* Styles collectés de la page */
            ${collectStyles()}
          </style>
        </head>
        <body>
          ${clonedContent.outerHTML}

          <script>
            window.onload = function() {
              // Attendre que tout soit chargé avant d'imprimer
              setTimeout(function() {
                window.print();

                // Fermer la fenêtre après impression (optionnel)
                setTimeout(function() {
                  window.close();
                }, 500);
              }, 250);
            };
          </script>
        </body>
      </html>
    `;

    // Écrit le contenu dans la nouvelle fenêtre
    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Callback après impression
    setTimeout(() => {
      onAfterPrint?.();
    }, 1000);

  }, []);

  return { printComponent };
};

export default usePrint;
