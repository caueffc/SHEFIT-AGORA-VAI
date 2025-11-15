// ========================================
// FUNÇÕES DE GERENCIAMENTO DO CARRINHO
// ========================================

/**
 * Adiciona um produto ao carrinho
 * @param {Object} produto - Objeto contendo os dados do produto
 */
function adicionarAoCarrinho(produto) {
  // Recupera o carrinho do localStorage ou cria um array vazio
  let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  
  // Verifica se o produto já existe no carrinho
  const produtoExistente = carrinho.find(item => item.id === produto.id);
  
  if (produtoExistente) {
    // Se já existe, incrementa a quantidade
    produtoExistente.quantidade += 1;
  } else {
    // Se não existe, adiciona com quantidade 1
    produto.quantidade = 1;
    carrinho.push(produto);
  }
  
  // Salva o carrinho atualizado no localStorage
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  
  // Atualiza o contador do carrinho (se existir)
  atualizarContadorCarrinho();
  
  return true;
}

/**
 * Remove um produto do carrinho
 * @param {number} produtoId - ID do produto a ser removido
 */
function removerDoCarrinho(produtoId) {
  let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  carrinho = carrinho.filter(item => item.id !== produtoId);
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  atualizarContadorCarrinho();
}

/**
 * Atualiza a quantidade de um produto no carrinho
 * @param {number} produtoId - ID do produto
 * @param {number} novaQuantidade - Nova quantidade
 */
function atualizarQuantidade(produtoId, novaQuantidade) {
  let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  const produto = carrinho.find(item => item.id === produtoId);
  
  if (produto) {
    if (novaQuantidade <= 0) {
      removerDoCarrinho(produtoId);
    } else {
      produto.quantidade = novaQuantidade;
      localStorage.setItem('carrinho', JSON.stringify(carrinho));
    }
  }
}

/**
 * Retorna todos os produtos do carrinho
 * @returns {Array} Array com os produtos do carrinho
 */
function obterCarrinho() {
  return JSON.parse(localStorage.getItem('carrinho')) || [];
}

/**
 * Limpa todo o carrinho
 */
function limparCarrinho() {
  localStorage.removeItem('carrinho');
  atualizarContadorCarrinho();
}

/**
 * Calcula o total do carrinho
 * @returns {number} Valor total do carrinho
 */
function calcularTotal() {
  const carrinho = obterCarrinho();
  return carrinho.reduce((total, item) => {
    const preco = parseFloat(item.preco) || 0;
    return total + (preco * item.quantidade);
  }, 0);
}

/**
 * Atualiza o contador visual do carrinho (badge)
 */
function atualizarContadorCarrinho() {
  const carrinho = obterCarrinho();
  const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
  
  // Procura por um elemento com id "carrinho-contador" e atualiza
  const contador = document.getElementById('carrinho-contador');
  if (contador) {
    contador.textContent = totalItens;
    contador.style.display = totalItens > 0 ? 'inline' : 'none';
  }
}

/**
 * Obtém a quantidade total de itens no carrinho
 * @returns {number} Quantidade total de itens
 */
function obterQuantidadeTotal() {
  const carrinho = obterCarrinho();
  return carrinho.reduce((total, item) => total + item.quantidade, 0);
}
