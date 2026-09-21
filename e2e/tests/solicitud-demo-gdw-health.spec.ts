import { test } from '@playwright/test';
import { SolucionesPage } from '../pages/SolucionesPage';
import { GdwHealthPage, DatosFormularioDemo } from '../pages/GdwHealthPage';

const datosFormulario: DatosFormularioDemo = {
  nombreCompleto: 'John Smith Prueba',
  correoElectronico: 'info@godoworks.com',
  telefono: '59895654785',
  cargoPosicion: 'Analista QA + IA',
  ciudadPais: 'Uruguay',
};

test.describe('Solicitud de demostración - GDW Health', () => {
  test('Enviar consulta sin Nombre de la empresa muestra error "Faltan datos"', async ({ page }) => {
    const soluciones = new SolucionesPage(page);
    const gdwHealth = new GdwHealthPage(page);

    await test.step('Ir a la página de Soluciones', async () => {
      await soluciones.goto();
      await soluciones.verificarCargada();
    });

    await test.step('Entrar a GDW Health', async () => {
      await soluciones.clickGdwHealth();
    });

    await test.step('Solicitar una demostración', async () => {
      await gdwHealth.clickSolicitarDemostracion();
      await gdwHealth.verificarFormularioVisible();
    });

    await test.step('Completar el formulario dejando "Nombre de la empresa" vacío', async () => {
      await gdwHealth.completarFormulario(datosFormulario);
      await gdwHealth.verificarCampoEmpresaVacio();
    });

    await test.step('Marcar el captcha "Soy humano"', async () => {
      await gdwHealth.marcarCaptchaSoyHumano();
    });

    await test.step('Enviar la consulta', async () => {
      await gdwHealth.clickEnviarConsulta();
    });

    await test.step('Verificar el mensaje de error "Faltan datos. Revisá los campos marcados."', async () => {
      await gdwHealth.verificarErrorFaltanDatos();
      await page.screenshot({ path: 'e2e/evidencias/error-faltan-datos.png', fullPage: true });
    });
  });
});
