import { Page, Locator } from '@playwright/test';

export class ConfirmationCodePage {

  readonly page: Page;
  readonly title: Locator;
  readonly codeInputs: Locator;
  readonly confirmButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByRole('heading', { name: 'Подтверждение email' });
    this.codeInputs = page.locator('[data-cy^="input--code--"]');
    this.confirmButton = page.getByRole('button', { name: 'Подтвердить' });
  }

    // Ждем загрузки страницы
  async waitForPageLoad() {
    await this.title.waitFor({ state: 'visible', timeout: 5000 });
  }

    // Ввод замоканного кода 000000
  async fillCode(code: string) {
    if (code.length !== 6) {
      throw new Error('Код должен состоять из 6 цифр');
    }
    const inputs = await this.codeInputs.all();
    for (let i = 0; i < inputs.length; i++) {
      await inputs[i].fill(code[i]);
    }
  }
  
    // Клик по кнопке подтверждения
  async clickConfirm() {
    await this.confirmButton.click();
  }

    // Проверить, активна ли кнопка подтверждения
  async isConfirmButtonEnabled(): Promise<boolean> {
    return await this.confirmButton.isEnabled();
  }
}