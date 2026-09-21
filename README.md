# GoDoWorks QA Test — Solicitud de demo GDW Health

Automatización E2E con Playwright + TypeScript del flujo:
Soluciones → GDW Health → Solicitar demostración → completar formulario (sin "Nombre de la empresa") → Enviar consulta → verificar error "Faltan datos. Revisá los campos marcados."

Reporte de incidencia del hallazgo observado en el paso 7: [`reporte-incidencia/REPORTE-BUG.md`](./reporte-incidencia/REPORTE-BUG.md)

## Requisitos
- Node.js 18+

## Instalación
```bash
npm install
npx playwright install chromium
```

## Ejecutar
```bash
npm test            # headless
npm run test:headed # con navegador visible
npm run test:report # abrir el último reporte HTML
```

## Nota sobre el captcha
El formulario usa hCaptcha real (no un sitekey de test). El test hace click en el checkbox
"Soy humano" tal como pide el flujo, pero no resuelve el reto visual que hCaptcha puede
disparar (eso sería evasión de un mecanismo anti-bot y no corresponde automatizarlo).
Esto no afecta el resultado esperado: la validación de campos obligatorios (incluida
"Nombre de la empresa") se dispara del lado del cliente antes de evaluar el captcha, por lo
que el mensaje "Faltan datos. Revisá los campos marcados." aparece de forma determinística.

## Por qué Playwright

Elegí Playwright por sobre Selenium o Cypress por lo que me facilita en el día a día de automatización:

- **Auto-waiting real**: espera automáticamente a que un elemento esté visible, habilitado y estable antes de interactuar, sin `sleep()` ni waits arbitrarios. En este ejercicio eso importó concretamente al lidiar con el iframe de hCaptcha, que aparece y desaparece de forma dinámica.
- **Soporte nativo de iframes y frames anidados** (`frameLocator`) — necesario acá porque tanto el checkbox del captcha como el reto visual viven dentro de iframes de terceros. Con Selenium eso implica cambiar de contexto manualmente (`switchTo().frame()`) en cada interacción.
- **Un solo lenguaje/runtime para todo**: TypeScript tanto para la UI como para tests de API, sin depender de drivers de navegador externos (Playwright los gestiona con `npx playwright install`).
- **Trazas y reportes integrados**: trace viewer, screenshot y video automáticos en fallos (`trace: 'on-first-retry'`, `screenshot: 'only-on-failure'`), sin plugins adicionales como sí requiere Selenium con Allure.
- **Velocidad de ejecución**: al comunicarse por protocolo (CDP) en vez de por WebDriver/HTTP, los tests corren notablemente más rápido, lo que se nota en proyectos con cientos de tests (como GAC o Pantallas Llamadoras).

Cypress lo descarté para este caso porque su modelo de un solo dominio/origen por test complica probar formularios con iframes cross-origin como hCaptcha. Selenium sigue siendo sólido pero implica más código boilerplate para lograr lo mismo (waits explícitos, manejo manual de frames).
