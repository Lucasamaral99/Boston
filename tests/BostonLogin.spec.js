// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Fluxo de Login', () => {

  test.describe('Login', () => {

    test.beforeEach(async ({page}) => {
      await page.goto('https://jsapps.cdxs1uh7v-bostonsci2-d5-public.model-t.cc.commerce.ondemand.com/');
      await expect(page).toHaveTitle(/Home/);
      await page.getByRole('link', {name: 'Entrar' }).click();
      await expect(page).toHaveTitle(/Login/, { timeout: 40000 })
    });

test('@Login Boston- Medico', async ({ page }) => {
   // Preenche o campo de e-mail
  await page.getByRole('textbox', { name: 'E-mail' }).click();
  await page.getByRole('textbox', { name: 'E-mail' }).fill('medico.hospital.amaral@yopmail.com');
  
  // Preenche o campo de senha
  await page.getByRole('textbox', { name: 'Senha' }).click();
  await page.getByRole('textbox', { name: 'Senha' }).fill('Kleber12345678@');
  await page.getByRole('button', {name: 'ENTRAR' }).click({ timeout: 30000 });
  // Procura nome do cliente
  await expect(page.locator('app-custom-header').getByText('Olá, Dr teste Medico ATT ')).toBeVisible({ timeout: 40000 });; // 15 segundos
  await page.screenshot({path: 'screenshot/screenshot_MEDI.png'})
});

test('@Login Boston- Hospital', async ({ page }) => {
   // Preenche o campo de e-mail
  await page.getByRole('textbox', { name: 'E-mail' }).click();
  await page.getByRole('textbox', { name: 'E-mail' }).fill('hospital.cidade@yopmail.com');
  // Preenche o campo de senha
  await page.getByRole('textbox', { name: 'Senha' }).click();
  await page.getByRole('textbox', { name: 'Senha' }).fill('Kleber12345678@');
  await page.getByRole('button', {name: 'ENTRAR' }).click({ timeout: 30000 });
  // Procura nome do cliente
  await expect(page.locator('app-custom-header').getByText(' Olá, HOSPITAL DA CIDADE DE PASSO FU')).toBeVisible({ timeout: 40000 });;
  await page.screenshot({path: 'screenshot/screenshot_HOSP.png'})
});

test('@Login Boston- Funcionario', async ({ page }) => {

  await page.getByRole('textbox', { name: 'E-mail' }).click();
  await page.getByRole('textbox', { name: 'E-mail' }).fill('hospital.cidade.funcionario2@yopmail.com');
  await page.getByRole('textbox', { name: 'Senha' }).click();
  await page.getByRole('textbox', { name: 'Senha' }).fill('Kleber12345678@');
  await page.getByRole('button', { name: 'ENTRAR' }).click({ timeout: 30000 });

  await expect(page.locator('app-custom-header').getByText('Olá, Teste Funcionário 2')).toBeVisible({ timeout: 40000 });;

  await page.screenshot({path: 'screenshot/screenshot_FUNC.png'})
});

test ('@Login Boston- Paciente CPF', async({page}) => {
    await expect(page).toHaveTitle(/Login/, {timeout: 40000})
    await page.getByRole('textbox', {name: 'E-mail'}).click();
    await page.getByRole('textbox', { name: 'E-mail' }).fill('hospital.cidade.paciente4@yopmail.com');
    await page.getByRole('textbox', { name: 'Senha' }).click();
    await page.getByRole('textbox', { name: 'Senha' }).fill('Kleber12345678@');

    await page.getByRole('button', {name: 'ENTRAR'}).click({timeout: 30000})

  await expect(page.locator('app-custom-header').getByText('Olá, Teste Paciente CPF')).toBeVisible({ timeout: 40000 });;

  await page.screenshot({path: 'screenshot/screenshot_PAC_CPF.png'})
});


test ('@Login Boston- Paciente CNPJ', async({page}) => {
    await expect(page).toHaveTitle(/Login/, {timeout: 40000})
    await page.getByRole('textbox', {name: 'E-mail'}).click();
    await page.getByRole('textbox', { name: 'E-mail' }).fill('hospital.cidade.paciente34@yopmail.com');
    await page.getByRole('textbox', { name: 'Senha' }).click();
    await page.getByRole('textbox', { name: 'Senha' }).fill('Kleber12345678@');

     await page.getByRole('button', {name: 'ENTRAR'}).click({timeout: 30000})

  await expect(page.locator('app-custom-header').getByText('Olá, Teste Paciente CNPJ')).toBeVisible({ timeout: 40000 });;

  await page.screenshot({path: 'screenshot/screenshot_PAC_CNPJ.png'})
});

test ('@Login Boston- Fornecedor', async({page}) => {

    await expect(page).toHaveTitle(/Login/, {timeout: 40000})
    await page.getByRole('textbox', {name: 'E-mail'}).click();
    await page.getByRole('textbox', { name: 'E-mail' }).fill('hospital.cidade.paciente30@yopmail.com');
    await page.getByRole('textbox', { name: 'Senha' }).click();
    await page.getByRole('textbox', { name: 'Senha' }).fill('Kleber12345678@');
    await page.getByRole('button', {name: 'ENTRAR'}).click({timeout: 40000})

  await expect(page.locator('app-custom-header').getByText('Olá, Fornecedor')).toBeVisible({ timeout: 40000 });;

  await page.screenshot({path: 'screenshot/screenshot_PAC_FORNE.png'})
});

test ('@Login Boston- Distribuidor', async({page}) => {

    await expect(page).toHaveTitle(/Login/, {timeout: 40000})
    await page.getByRole('textbox', {name: 'E-mail'}).click();
    await page.getByRole('textbox', { name: 'E-mail' }).fill('tnk.distribuidor1@yopmail.com');
    await page.getByRole('textbox', { name: 'Senha' }).click();
    await page.getByRole('textbox', { name: 'Senha' }).fill('Teste@teste123');

    await page.getByRole('button', {name: 'ENTRAR'}).click({timeout: 30000})

  await expect(page.locator('app-custom-header').getByText('Olá, TNK DISTRIBUIDOR 1')).toBeVisible({ timeout: 40000 });;

  await page.screenshot({path: 'screenshot/screenshot_PAC_DISTRI.png'})
});

  });
});