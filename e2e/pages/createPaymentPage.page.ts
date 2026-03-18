import { Page, Locator } from '@playwright/test';

export class CreatePaymentPage {
  readonly page: Page;

  // Заголовок страницы
  readonly title:Locator

  // Поле "К оплате"
  readonly fromAmountInput: Locator;
  readonly fromCurrencySelect: Locator;
  readonly fromCurrencyOptions: Locator;
  readonly fromAmountHint: Locator;

  // Поле "К получению"
  readonly toAmountInput: Locator;
  readonly toCurrencySelect: Locator;
  readonly toCurrencyOptions: Locator;

  // Кнопка "Продолжить"
  readonly continueButton: Locator;

  // Модальное окно верификации
  readonly verificationModal: Locator;
  readonly verificationModalSkip: Locator;
  readonly skipVerificationButtonFirst: Locator;
  readonly skipVerificationButtonSecond: Locator;

  constructor(page: Page) {
    this.page = page;

    // Заголовок страницы
    this.title = page.getByRole('heading', { name: 'Главная' })

    // Поле "К оплате"
    const fromWrapper = page.locator('[data-cy="send--input-and-select"]');
    this.fromAmountInput = fromWrapper.locator('input.el-input__inner');
    this.fromCurrencySelect = fromWrapper.locator('.el-select');
    this.fromCurrencyOptions = fromWrapper.locator('.el-select-dropdown:has-text("RUB")');
    this.fromAmountHint = fromWrapper.getByTestId('[data-cy="hint-message"]')

    // Поле "К получению"
    const toWrapper = page.locator('[data-cy="receive--input-and-select"]');
    this.toAmountInput = toWrapper.locator('input.el-input__inner');
    this.toCurrencySelect = toWrapper.locator('.el-select');
    this.toCurrencyOptions = toWrapper.locator('.el-select-dropdown:has-text("USD")');

    // Кнопка "Продолжить"
    this.continueButton = page.locator('[data-cy="btn--continue"]');

    // Модальное окно верификации
    this.verificationModal = page.locator('.el-overlay .el-dialog:has-text("Требуется проверка")');
    this.verificationModalSkip = page.locator('.el-overlay .el-dialog:has-text("Пропустить проверку")');
    this.skipVerificationButtonFirst = this.verificationModal.locator('[data-cy="btn--secondary"]:has-text("Пропустить в этот раз")');
    this.skipVerificationButtonSecond = this.verificationModalSkip.locator('[data-cy="btn--secondary"]:has-text("Пропустить")');
  }

  // Заполнить сумму отправления
  async fillFromAmount(amount: string) {
    await this.fromAmountInput.fill(amount);
  }

  // Заполнить сумму получения
  async fillToAmount(amount: string) {
    await this.toAmountInput.fill(amount);
  }

  // Выбрать валюту получения
  async selectToCurrency(currency: string) {
    await this.toCurrencySelect.click();
    const option = this.page.locator(`.el-select-dropdown__item:has-text("${currency}")`);
    await option.click();
  }

  // Проверить, активна ли кнопка "Продолжить"
  async isContinueButtonEnabled(): Promise<boolean> {
    return await this.continueButton.isEnabled();
  }

  // Проверить наличие хинта под инпутом "К оплате"
  async getFromAmountHintText(): Promise<string | null> {
    const wrapper = this.page.locator('.control-wrapper__wrapper')
      .filter({ has: this.page.locator('[data-cy="send--input-and-select"]') });
    const hint = wrapper.locator('.control-wrapper__hint [data-cy="hint-message"]');

    if (await hint.isVisible()) {
      return await hint.textContent();
    }
    return null;
  }

  // Нажать кнопку "Продолжить"
  async clickContinue() {
    await this.continueButton.click();
  }

  // Дождаться появления модального окна верификации
  async waitForVerificationModal() {
    await this.verificationModal.waitFor({ state: 'visible', timeout: 5000 });
  }

  // Пропустить верификацию
  async skipVerification() {
    await this.skipVerificationButtonFirst.click();
    await this.skipVerificationButtonSecond.click();
  }

  // Проверить, отображается ли модальное окно
  async isVerificationModalVisible(): Promise<boolean> {
    return await this.verificationModal.isVisible();
  }
}