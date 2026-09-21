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
