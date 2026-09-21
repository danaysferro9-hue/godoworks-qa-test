import { Page, expect } from '@playwright/test';

export interface DatosFormularioDemo {
  nombreCompleto: string;
  correoElectronico: string;
  telefono: string;
  cargoPosicion: string;
  ciudadPais: string;
  // "empresa" se omite a propósito: el caso de prueba deja ese campo vacío.
}

export class GdwHealthPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/gdw-health/');
  }

  private get formHeading() {
    return this.page.getByRole('heading', { name: 'Contáctanos y obtén más información sobre nuestras soluciones' });
  }

  private get nombreCompletoInput() {
    return this.page.getByRole('textbox', { name: 'Nombre completo' });
  }

  private get correoInput() {
    return this.page.getByRole('textbox', { name: 'Correo electrónico corporativo' });
  }

  private get telefonoInput() {
    return this.page.getByRole('textbox', { name: 'Telefono de contacto' });
  }

  private get empresaInput() {
    return this.page.getByRole('textbox', { name: 'Nombre de la empresa' });
  }

  private get cargoInput() {
    return this.page.getByRole('textbox', { name: 'Cargo o posición' });
  }

  private get ciudadPaisInput() {
    return this.page.getByRole('textbox', { name: 'Ciudad/País' });
  }

  private get captchaCheckbox() {
    return this.page
      .frameLocator('iframe[title="Widget que contiene una casilla de verificación para el desafío de seguridad de hCaptcha"]')
      .getByRole('checkbox', { name: /Soy humano/ });
  }

  private get enviarConsultaButton() {
    return this.page.getByRole('button', { name: 'Enviar consulta' });
  }

  private get mensajeErrorFaltanDatos() {
    return this.page.getByText('Faltan datos. Revisá los campos marcados.');
  }

  async clickSolicitarDemostracion() {
    await this.page.getByRole('link', { name: 'Solicita una Demo', exact: true }).click();
  }

  async verificarFormularioVisible() {
    await expect(this.formHeading).toBeVisible();
    await expect(this.enviarConsultaButton).toBeVisible();
  }

  async completarFormulario(datos: DatosFormularioDemo) {
    await this.nombreCompletoInput.fill(datos.nombreCompleto);
    await this.correoInput.fill(datos.correoElectronico);
    await this.telefonoInput.fill(datos.telefono);
    // "empresaInput" se deja vacío deliberadamente (dato del caso de prueba).
    await this.cargoInput.fill(datos.cargoPosicion);
    await this.ciudadPaisInput.fill(datos.ciudadPais);
  }

  async marcarCaptchaSoyHumano() {
    await this.captchaCheckbox.click();
    // El click puede disparar un reto visual de hCaptcha que intercepta clicks
    // posteriores sobre el formulario. Se cierra con Escape si llegara a aparecer.
    await this.page.keyboard.press('Escape').catch(() => {});
  }

  async clickEnviarConsulta() {
    await this.enviarConsultaButton.click();
  }

  async verificarErrorFaltanDatos() {
    await expect(this.mensajeErrorFaltanDatos).toBeVisible();
  }

  async verificarCampoEmpresaVacio() {
    await expect(this.empresaInput).toHaveValue('');
  }
}
