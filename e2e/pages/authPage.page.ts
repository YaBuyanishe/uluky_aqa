import { Page, Locator } from '@playwright/test';

export class AuthPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly nextButton: Locator;
  readonly loginButton: Locator;
  readonly pageTitle: Locator;

  constructor(page: Page) {
    this.page = page;

    this.emailInput = page.locator('[type="email"]');
    this.passwordInput = page.locator('[type="password"]');
    this.nextButton = page.getByRole('button', { name: 'Далее' });
    this.loginButton = page.getByRole('button', { name: 'Войти' })
    this.pageTitle = page.getByRole('heading', { name: 'Учетная запись' });
  }

    // Ожидание загрузки страницы
  async waitForPageLoad() {
    await this.pageTitle.waitFor({ state: 'visible', timeout: 5000 });
  }

    // Ввести email пользователя
  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

    // Ввести пароль пользователя
  async fillPassword(password: string) {
    await this.passwordInput.fill(password)
  }   

      // Проверить, что кнопка "Войти" активна
  async isLoginButtonEnabled(): Promise<boolean> {
    return await this.loginButton.isEnabled();
  }

    // Нажать кнопку "Войти"
  async clickLogin() {
    await this.loginButton.click()
  }

    // Нажать кнопку "Далее"
  async clickNext() {
    await this.nextButton.click();
  }

    // Проверить, что кнопка "Далее" активна
  async isNextButtonEnabled(): Promise<boolean> {
    return await this.nextButton.isEnabled();
  }
}