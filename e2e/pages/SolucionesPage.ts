import { Page, expect } from '@playwright/test';

export class SolucionesPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/soluciones/');
  }

  async verificarCargada() {
    await expect(this.page.getByRole('heading', { name: 'Las diez soluciones de GoDoWorks' })).toBeVisible();
  }

  async clickGdwHealth() {
    await this.page.getByRole('link', { name: 'GDW Health' }).click();
  }
}
