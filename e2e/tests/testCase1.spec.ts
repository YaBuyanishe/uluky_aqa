import { expect, test } from "@playwright/test";
import { AuthPage } from "../pages/authPage.page";
import { ConfirmationCodePage } from "../pages/confirmationCode.page"
import { CreatePaymentPage } from "../pages/createPaymentPage.page";

const baseUrl = process.env.BASE_URL as string

const user = {
    login: process.env.LOGIN as string,
    password: process.env.PASSWORD as string
}

const code = process.env.CODE as string

test.describe(
    'Test Case 1 - Home Page -> Create Payment -> Minimum payment amount', 
    () => {
    test('Минимальная сумма платежа', async ({ page }) => {

        const authPage = new AuthPage(page);
        const confirmationCodePage = new ConfirmationCodePage(page);
        const createPaymentPage = new CreatePaymentPage(page);

        await test.step('Авториазция', async () => {
            await page.goto(baseUrl);
        })

        await test.step('Проверяем, что страница загрузилась', async() => {
            await authPage.waitForPageLoad();
        })

        await test.step('Авторизуемся используя email пользователя', async () => {
            await authPage.fillEmail(user.login);
            await authPage.isNextButtonEnabled();
            await authPage.clickNext();
            await confirmationCodePage.waitForPageLoad();
            await confirmationCodePage.fillCode(code);
            await confirmationCodePage.clickConfirm;
            await authPage.fillPassword(user.password);
            await authPage.isLoginButtonEnabled();
            await authPage.clickLogin();
        })

        await test.step('Проверка минимальной суммы перевода', async () => {
            await createPaymentPage.skipVerification();
            await createPaymentPage.selectToCurrency('CNY');
            await createPaymentPage.fillToAmount('1000');
            await createPaymentPage.getFromAmountHintText();

        await test.step('Проверяем текст хинта о минимальной сумме перевода', async () => {
            await expect
                .poll(async () => await createPaymentPage.getFromAmountHintText(), {})
            .toMatch(/^Сумма должна быть не менее/);
        });
           
        await test.step('Проверяем, что кнопка "Продолжить" не активна', async () => {
            await expect(createPaymentPage.continueButton).toBeDisabled();
            });
        });
    })
})
