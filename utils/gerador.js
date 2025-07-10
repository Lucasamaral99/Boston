const gerarDigitoAleatorio = () => Math.floor(Math.random() * 10);

/**
 * Calcula um dígito verificador baseado em uma base numérica e pesos.
 * @param {number[]} base - Array de números base para o cálculo.
 * @param {number | number[]} weightsOrFactor - Se for um número (factor), gera pesos decrescentes. Se for um array, usa os pesos fornecidos.
 * @returns {number} O dígito verificador calculado.
 */
const calcularDigitoVerificador = (base, weightsOrFactor) => {
  let total = 0;
  let weights = [];

  // Determina se os pesos serão gerados ou se já foram fornecidos
  if (typeof weightsOrFactor === 'number') {
    // Caso para CPF: pesos decrescentes (ex: 10, 9, 8...)
    for (let i = 0; i < base.length; i++) {
      weights.push(weightsOrFactor - i);
    }
  } else {
    // Caso para CNPJ: pesos específicos fornecidos como array
    weights = weightsOrFactor;
  }

  // Calcula a soma 
  total = base.reduce((sum, num, i) => sum + num * weights[i], 0);

  const rest = total % 11;
  return rest < 2 ? 0 : 11 - rest;
};

/**
 * Gera um número de CPF válido (apenas dígitos).
 * @returns {string} O CPF gerado.
 */
export function gerarCPF() {
  const cpfBase = Array.from({ length: 9 }, gerarDigitoAleatorio);

  const dv1 = calcularDigitoVerificador(cpfBase, 10); // Factor 10 para o primeiro DV
  const dv2 = calcularDigitoVerificador(cpfBase.concat(dv1), 11); // Factor 11 para o segundo DV

  return cpfBase.concat([dv1, dv2]).join('');
}

/**
 * Formata um CPF numérico para o formato XX.XXX.XXX-XX.
 * @param {string} cpf - O CPF a ser formatado (apenas dígitos).
 * @returns {string} O CPF formatado.
 */
export function formatarCPF(cpf) {
  // Garante que o CPF tenha 11 dígitos antes de formatar
  if (cpf.length !== 11 || !/^\d+$/.test(cpf)) {
    console.warn('CPF inválido para formatação. Deve conter 11 dígitos numéricos.');
    return cpf; // Retorna o original se for inválido
  }
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

/**
 * Gera um número de CNPJ válido (apenas dígitos).
 * @returns {string} O CNPJ gerado.
 */
export function gerarCNPJ() {
  // 8 dígitos aleatórios + a parte fixa 0001 (filial)
  const cnpjBase = Array.from({ length: 8 }, gerarDigitoAleatorio).concat([0, 0, 0, 1]);

  // Pesos para o primeiro DV do CNPJ
  const pesosDV1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const dv1 = calcularDigitoVerificador(cnpjBase, pesosDV1);

  // Pesos para o segundo DV do CNPJ (inclui o DV1 no cálculo da base)
  const pesosDV2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const dv2 = calcularDigitoVerificador(cnpjBase.concat(dv1), pesosDV2);

  return cnpjBase.concat([dv1, dv2]).join('');
}

/**
 * Formata um CNPJ numérico para o formato XX.XXX.XXX/YYYY-ZZ.
 * @param {string} cnpj - O CNPJ a ser formatado (apenas dígitos).
 * @returns {string} O CNPJ formatado.
 */
export function formatarCNPJ(cnpj) {
  // Garante que o CNPJ tenha 14 dígitos antes de formatar
  if (cnpj.length !== 14 || !/^\d+$/.test(cnpj)) {
    console.warn('CNPJ inválido para formatação. Deve conter 14 dígitos numéricos.');
    return cnpj; // Retorna o original se for inválido
  }
  return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

/**
 * Gera um e-mail dinâmico com um timestamp para garantir unicidade.
 * @param {string} [dominio='yopmail.com'] - O domínio do e-mail. Padrão para 'yopmail.com'.
 * @returns {string} O e-mail dinâmico gerado.
 */
export function gerarEmailDinamicoComTimestamp(dominio = 'yopmail.com') {
  const timestamp = new Date().getTime();
  return `teste.automacao.${timestamp}@${dominio}`;
}
