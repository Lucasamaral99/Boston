// @ts-check
import { test, expect } from '@playwright/test';
import {
  gerarCPF,
  formatarCPF,
  gerarCNPJ, 
  formatarCNPJ, 
  gerarEmailDinamicoComTimestamp 
} from '../utils/gerador.js';

test.describe('Fluxo de Cadastro', () => {

    test.beforeEach(async ({page}) => {
      await page.goto('https://jsapps.cdxs1uh7v-bostonsci2-d5-public.model-t.cc.commerce.ondemand.com/');
      await page.getByRole('link', { name: 'Cadastre-se' }).click();
      await expect(page).toHaveTitle(/Create an Account/, { timeout: 40000 });
      await page.getByRole('contentinfo').getByRole('button').nth(1).click(); // Aceitar cookies/modal
      await page.evaluate(() => window.scrollBy(0, 300)); // Rolagem inicial
    })

  test('Cadastro de Medico- Boston', async ({ page }) => {
    // Geração de dados dinâmicos
    const cpfGerado = formatarCPF(gerarCPF());
    const emailDinamico = gerarEmailDinamicoComTimestamp();

    // Passo principal: Preenchimento do Formulário de Dados Pessoais e Conselho
    await test.step('Preencher Dados Pessoais e de Conselho', async () => {
      await page.getByRole('textbox', { name: 'Digite o seu nome completo (m' }).fill('Teste Automacao');

      // Sub-passo: Preenche CPF e aguarda carregamento
      await test.step('Preencher CPF e aguardar validação', async () => {
        try {
          await page.getByRole('textbox', { name: '000.000.000-' }).fill(cpfGerado, { timeout: 50000 });
          await page.waitForSelector('cx-spinner', { state: 'detached', timeout: 30000 });
        } catch (error) {
          console.error('Erro ao preencher CPF ou esperar carregamento:', 50000);
          await page.screenshot({ path: 'screenshot/erro_cpf.png' });
          throw error;
        }
      });

      await page.getByLabel('Tipo de Conselho *').selectOption('R001');
      await page.getByRole('textbox', { name: '0000000000' }).fill('111111111111');
      await page.getByLabel('UF do Conselho *').selectOption('RS', { timeout: 50000 });
      await page.waitForTimeout(12000);
    });

    // Passo principal: Preenchimento do Formulário de Endereço
    await test.step('Preencher Dados de Endereço', async () => {
      await page.evaluate(() => window.scrollBy(0, 600));

      await page.getByRole('textbox', { name: '00000-000', exact: true }).fill('99010-290');
      await page.getByRole('textbox', { name: 'Digite o seu endereço' }).fill('Rua Teste');
      await page.getByRole('textbox', { name: '0000', exact: true }).first().fill('123');
      await page.getByRole('textbox', { name: 'Digite o complemento' }).fill('456');
      await page.selectOption('select[formcontrolname="state"]', { label: 'RS' });
      await page.waitForTimeout(1000);
      await page.selectOption('select[formcontrolname="city"]', { label: 'Passo Fundo' });
      await page.waitForTimeout(1000);
      await page.selectOption('select[formcontrolname="country"]', { label: 'Brasil' });
    });

    // Passo principal: Preenchimento dos Dados de Contato
    await test.step('Preencher Informações de Contato', async () => {
      await page.evaluate(() => window.scrollBy(0, 600)); // Scroll até Pessoa de Contato

      await page.getByRole('textbox', { name: 'Digite o nome (máximo de 30' }).fill('Teste Contato');
      await page.getByRole('textbox', { name: 'Digite o e-mail pessoal de' }).fill(emailDinamico);
      await page.getByRole('textbox', { name: '00000-0000' }).fill('11 11111-11111');
    });

    // Passo principal: Preenchimento dos Dados de Acesso e Conta Bancária
    await test.step('Preencher Dados de Acesso e Conta Bancária', async () => {
      await page.evaluate(() => window.scrollBy(0, 600)); // Scroll até Dados de Acesso

      await page.getByRole('textbox', { name: 'Digite a razão social (máximo' }).fill('Teste AUTOMACAO');
      await page.getByRole('textbox', { name: 'Digite o seu CNPJ ou CPF' }).fill(cpfGerado);

      await page.selectOption('select[formcontrolname="bank"]', { label: '001-Banco do Brasil S.A.' });
      await page.getByRole('textbox', { name: '0000', exact: true }).nth(1).fill('1111');
      await page.getByRole('textbox', { name: '0000', exact: true }).nth(2).fill('112211');

      await page.getByRole('textbox', { name: 'Digite o seu e-mail' }).fill(emailDinamico);
      await page.getByRole('textbox', { name: 'Digite a sua senha' }).fill('Kleber12345678@');
      await page.getByRole('textbox', { name: 'Repita a sua senha' }).fill('Kleber12345678@');
    });

    // Passo principal: Aceitar Termos e Finalizar Cadastro
    await test.step('Aceitar Termos e Finalizar Cadastro', async () => {
      const label = page.locator('label[for="registerTerms"]');
      await label.scrollIntoViewIfNeeded();
      await label.click({ position: { x: 10, y: 10 } });
      await page.click('label[for="newsletter-box"]');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      await expect(page).toHaveTitle(/Login/, { timeout: 40000 });
    });
  }); // Fim do teste de Médico

  test('Cadastro de Hospital- Boston', async ({ page }) => {
    // Geração de dados dinâmicos
    const cnpjGerado = formatarCNPJ((gerarCNPJ()));
    const emailDinamico = gerarEmailDinamicoComTimestamp('yopmail.com');

    // Clicar na opcao Hospital 
    await test.step(`Clicar na opcao Hospital`, async () => {
      await page.getByRole('button', {name: `Sou Hospital / Clínica`}).click();
    })

    // Passo principal: Preenchimento do Formulário de Dados Pessoais e Conselho
    await test.step('Preencher Dados Pessoais e de Conselho do Hospital', async () => {
      await page.getByRole('textbox', { name: 'Digite o nome fantasia (máximo de 30 caracteres)' }).fill('Teste Automacao Hospital'); // Nome para hospital
      await page.selectOption(`select[formcontrolname="rankingValue"]`, {label: 'ONA 2'})
     

      // Sub-passo: Preenche CPFs/CNPJ e aguarda carregamento
      await test.step('Preencher CPF/CNPJ e aguardar validação', async () => {
        try {
          // Mantido 'cpfGerado' conforme o seu original, mas se for hospital, deveria ser CNPJ aqui.
          // Você pode mudar para .fill(cnpjFormatado) se o campo aceitar CNPJ formatado
          await page.getByRole('textbox', { name: '00.000.000/0000-00' }).fill(cnpjGerado, { timeout: 5000 });
          await page.waitForSelector('cx-spinner', { state: 'detached', timeout: 5000 });
        } catch (error) {
          console.error('Erro ao preencher CPF/CNPJ ou esperar carregamento:', error);
          await page.screenshot({ path: 'screenshot/erro_cpf_cadastro_hospital.png' });
          throw error;
        }
      });
      
      await page.locator('input[formcontrolname="tradeName"]').fill('Nome Fantasia do Hospital');
      await page.waitForTimeout(14000);
      await page.getByRole('textbox', { name: '00.000.000/0000-00' }).fill('');
      await page.getByRole('textbox', { name: '00.000.000/0000-00' }).fill(cnpjGerado);
    });

    // Passo principal: Preenchimento do Formulário de Endereço
    await test.step('Preencher Dados de Endereço do Hospital', async () => {
      await page.evaluate(() => window.scrollBy(0, 500));
      await page.getByRole('textbox', { name: '00000-000', exact: true }).fill('99010-290');
      await page.waitForTimeout(1000);
      await page.getByRole('textbox', { name: 'Digite o seu endereço' }).fill('Rua Teste');
      await page.getByRole('textbox', { name: '0000', exact: true }).first().fill('123');
      await page.getByRole('combobox').nth(1).selectOption({ label: 'RS' });

      await page.getByRole('textbox', { name: 'Cidade' }).fill('Passo Fundo');
      await page.waitForTimeout(1000);
      await page.getByRole('combobox').nth(2).selectOption( { label: 'Brasil' });
    });

    

    // Passo principal: Preenchimento dos Dados de Contato
    await test.step('Preencher Informações de Contato do Hospital', async () => {
      await page.evaluate(() => window.scrollBy(0, 600));

      await page.getByRole('textbox', { name: 'Digite o nome (máximo de 30' }).fill('Contato Hospital');
      await page.getByRole('textbox', { name: 'Digite o e-mail pessoal de' }).fill(emailDinamico);
      await page.getByRole('textbox', { name: '00000-0000' }).fill('11 11111-11111');
    });

    // Passo principal: Preenchimento dos Dados de Acesso e Conta Bancária
    await test.step('Preencher Dados de Acesso e Conta Bancária do Hospital', async () => {
      
      await page.getByRole('textbox', { name: 'Digite o seu CNPJ' }).fill(cnpjGerado);
      await page.locator('input[formcontrolname="bankCorporateName"]').nth(1).fill('Nome Fantasia do Hospital Dados Bancarios');

      await page.getByRole('combobox').nth(3).selectOption( { label: '001-Banco do Brasil S.A.' });
      await page.getByRole('textbox', { name: '0000', exact: true }).nth(1).fill('1111');
      await page.getByRole('textbox', { name: '0000', exact: true }).nth(2).fill('112211');

      await page.getByRole('textbox', { name: 'Digite o seu e-mail' }).fill(emailDinamico);
      await page.getByRole('textbox', { name: 'Digite a sua senha' }).fill('Kleber12345678@');
      await page.getByRole('textbox', { name: 'Repita a sua senha' }).fill('Kleber12345678@');
    });

    // Passo principal: Aceitar Termos e Finalizar Cadastro
    await test.step('Aceitar Termos e Finalizar Cadastro do Hospital', async () => {
      const label = page.locator('label[for="registerTerms"]');
      await label.scrollIntoViewIfNeeded();
      await label.click({ position: { x: 10, y: 10 } });
      await page.click('label[for="newsletter-box"]');
      await page.getByRole('button', { name: 'Cadastrar' }).click({timeout:5000});

      await expect(page).toHaveTitle(/Login/);
    });

  }); // Fim do teste de Hospital
  test('Cadastro de Fornecedor- Boston', async ({ page }) => {
    // Geração de dados dinâmicos
    const cnpjGerado = formatarCNPJ((gerarCNPJ()));
    const emailDinamico = gerarEmailDinamicoComTimestamp('yopmail.com');

    // Clicar na opcao Fabricante 
    await test.step(`Clicar na opcao Fabricante`, async () => {
      await page.getByRole('button', {name: `Sou Fabricante`}).click();
    })

    // Passo principal: Preenchimento do Formulário de Dados Pessoais e Conselho
    await test.step('Preencher Dados Pessoais e de Conselho do Fornecedor', async () => {
      await page.getByRole('textbox', { name: 'Digite o nome fantasia (máximo de 30 caracteres)' }).fill('Teste Automacao Fornecedor'); // Nome para hospital
      
      // Sub-passo: Preenche CPFs/CNPJ e aguarda carregamento
      await test.step('Preencher CPF/CNPJ e aguardar validação', async () => {
        try {
          await page.getByRole('textbox', { name: '00.000.000/0000-00' }).fill(cnpjGerado, { timeout: 5000 });
          await page.waitForSelector('cx-spinner', { state: 'detached', timeout: 5000 });
        } catch (error) {
          console.error('Erro ao preencher CPF/CNPJ ou esperar carregamento:', error);
          await page.screenshot({ path: 'screenshot/erro_cpf_cadastro_hospital.png' });
          throw error;
        }
      });
      await page.waitForTimeout(14000);
      await page.getByRole('textbox', { name: '00.000.000/0000-00' }).fill('');
      await page.getByRole('textbox', { name: '00.000.000/0000-00' }).fill(cnpjGerado);
    });

    // Passo principal: Preenchimento do Formulário de Endereço
    await test.step('Preencher Dados de Endereço do Fornecedor', async () => {
      await page.evaluate(() => window.scrollBy(0, 500));
      await page.getByRole('textbox', { name: '00000-000', exact: true }).fill('99010-290');
      await page.waitForTimeout(1000);
      await page.getByRole('textbox', { name: 'Digite o seu endereço' }).fill('Rua Teste');
      await page.getByRole('textbox', { name: '0000', exact: true }).first().fill('123');
      await page.getByRole('combobox').nth(1).selectOption({ label: 'RS' });

      await page.getByRole('textbox', { name: 'Cidade' }).fill('Passo Fundo');
      await page.waitForTimeout(1000);
      await page.getByRole('combobox').nth(2).selectOption( { label: 'Brasil' });
    });

    

    // Passo principal: Preenchimento dos Dados de Contato
    await test.step('Preencher Informações de Contato do Fornecedor', async () => {
      await page.evaluate(() => window.scrollBy(0, 600));

      await page.getByRole('textbox', { name: 'Digite o nome (máximo de 30' }).fill('Contato Fornecedor');
      await page.getByRole('textbox', { name: 'Digite o e-mail pessoal de' }).fill(emailDinamico);
      await page.getByRole('textbox', { name: '00000-0000' }).fill('11 11111-11111');
    });

    // Passo principal: Preenchimento dos Dados de Acesso e Conta Bancária
    await test.step('Preencher Dados de Acesso e Conta Bancária do Fornecedor', async () => {
      
      await page.getByRole('textbox', { name: 'Digite o seu CNPJ' }).fill(cnpjGerado);
      await page.locator('input[formcontrolname="bankCorporateName"]').nth(1).fill('Nome Fantasia do Fornecedor Dados Bancarios');

      await page.getByRole('combobox').nth(3).selectOption( { label: '001-Banco do Brasil S.A.' });
      await page.getByRole('textbox', { name: '0000', exact: true }).nth(1).fill('1111');
      await page.getByRole('textbox', { name: '0000', exact: true }).nth(2).fill('112211');

      await page.getByRole('textbox', { name: 'Digite o seu e-mail' }).fill(emailDinamico);
      await page.getByRole('textbox', { name: 'Digite a sua senha' }).fill('Kleber12345678@');
      await page.getByRole('textbox', { name: 'Repita a sua senha' }).fill('Kleber12345678@');
    });

    // Passo principal: Aceitar Termos e Finalizar Cadastro
    await test.step('Aceitar Termos e Finalizar Cadastro do Fornecedor', async () => {
      const label = page.locator('label[for="registerTerms"]');
      await label.scrollIntoViewIfNeeded();
      await label.click({ position: { x: 10, y: 10 } });
      await page.click('label[for="newsletter-box"]');
      await page.getByRole('button', { name: 'Cadastrar' }).click({timeout:5000});

      await expect(page).toHaveTitle(/Login/);
    });

  }) // fim fornecedor 
  test('Cadastro de Distribuidor- Boston', async ({ page }) => {
    // Geração de dados dinâmicos
    const cnpjGerado = formatarCNPJ((gerarCNPJ()));
    const emailDinamico = gerarEmailDinamicoComTimestamp('yopmail.com');

    // Clicar na opcao Distribuidor 
    await test.step(`Clicar na opcao Distribuidor`, async () => {
      await page.getByRole('button', {name: `Sou Distribuidor`}).click();
    })

    // Passo principal: Preenchimento do Formulário de Dados Pessoais e Conselho
    await test.step('Preencher Dados Pessoais e de Conselho do Distribuidor', async () => {
      await page.getByRole('textbox', { name: 'Digite o nome fantasia (máximo de 30 caracteres)' }).fill('Teste Automacao Distribuidor'); 
      await page.selectOption(`select[formcontrolname="rankingValue"]`, {label: 'ONA 2'})
     

      // Sub-passo: Preenche CPFs/CNPJ e aguarda carregamento
      await test.step('Preencher CPF/CNPJ e aguardar validação', async () => {
        try {
          await page.getByRole('textbox', { name: '00.000.000/0000-00' }).fill(cnpjGerado, { timeout: 5000 });
          await page.waitForSelector('cx-spinner', { state: 'detached', timeout: 5000 });
        } catch (error) {
          console.error('Erro ao preencher CPF/CNPJ ou esperar carregamento:', error);
          await page.screenshot({ path: 'screenshot/erro_cpf_cadastro_Distribuidor.png' });
          throw error;
        }
      });
      
      await page.locator('input[formcontrolname="tradeName"]').fill('Nome Fantasia do Distribuidor');
      await page.waitForTimeout(14000);
      await page.getByRole('textbox', { name: '00.000.000/0000-00' }).fill('');
      await page.getByRole('textbox', { name: '00.000.000/0000-00' }).fill(cnpjGerado);
    });

    // Passo principal: Preenchimento do Formulário de Endereço
    await test.step('Preencher Dados de Endereço do Distribuidor', async () => {
      await page.evaluate(() => window.scrollBy(0, 500));
      await page.getByRole('textbox', { name: '00000-000', exact: true }).fill('99010-290');
      await page.waitForTimeout(1000);
      await page.getByRole('textbox', { name: 'Digite o seu endereço' }).fill('Rua Teste');
      await page.getByRole('textbox', { name: '0000', exact: true }).first().fill('123');
      await page.getByRole('combobox').nth(1).selectOption({ label: 'RS' });

      await page.getByRole('textbox', { name: 'Cidade' }).fill('Passo Fundo');
      await page.waitForTimeout(1000);
      await page.getByRole('combobox').nth(2).selectOption( { label: 'Brasil' });
    });

    

    // Passo principal: Preenchimento dos Dados de Contato
    await test.step('Preencher Informações de Contato do Distribuidor', async () => {
      await page.evaluate(() => window.scrollBy(0, 600));

      await page.getByRole('textbox', { name: 'Digite o nome (máximo de 30' }).fill('Contato Distribuidor');
      await page.getByRole('textbox', { name: 'Digite o e-mail pessoal de' }).fill(emailDinamico);
      await page.getByRole('textbox', { name: '00000-0000' }).fill('11 11111-11111');
    });

    // Passo principal: Preenchimento dos Dados de Acesso e Conta Bancária
    await test.step('Preencher Dados de Acesso e Conta Bancária do Distribuidor', async () => {
      
      await page.getByRole('textbox', { name: 'Digite o seu CNPJ' }).fill(cnpjGerado);
      await page.locator('input[formcontrolname="bankCorporateName"]').nth(1).fill('Nome Fantasia do Distribuidor Dados Bancarios');

      await page.getByRole('combobox').nth(3).selectOption( { label: '001-Banco do Brasil S.A.' });
      await page.getByRole('textbox', { name: '0000', exact: true }).nth(1).fill('1111');
      await page.getByRole('textbox', { name: '0000', exact: true }).nth(2).fill('112211');

      await page.getByRole('textbox', { name: 'Digite o seu e-mail' }).fill(emailDinamico);
      await page.getByRole('textbox', { name: 'Digite a sua senha' }).fill('Kleber12345678@');
      await page.getByRole('textbox', { name: 'Repita a sua senha' }).fill('Kleber12345678@');
    });

    // Passo principal: Aceitar Termos e Finalizar Cadastro
    await test.step('Aceitar Termos e Finalizar Cadastro do Distribuidor', async () => {
      const label = page.locator('label[for="registerTerms"]');
      await label.scrollIntoViewIfNeeded();
      await label.click({ position: { x: 10, y: 10 } });
      await page.click('label[for="newsletter-box"]');
      await page.getByRole('button', { name: 'Cadastrar' }).click({timeout:5000});

      await expect(page).toHaveTitle(/Login/);
    });

  });
}); 