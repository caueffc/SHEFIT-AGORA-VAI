// ========================================
// INTEGRAÇÃO DO BOTÃO COMPRAR COM O CARRINHO
// ========================================

// Este código deve ser adicionado ao seu controller.js ou em um arquivo separado
// que seja carregado DEPOIS do controller.js na página produto.html

/**
 * Função para adicionar o produto atual ao carrinho
 * Deve ser chamada quando o usuário clicar no botão "Comprar"
 */
function comprarProduto() {
  // Obtém o ID do produto da URL
  const urlParams = new URLSearchParams(window.location.search);
  const produtoId = parseInt(urlParams.get('id'));
  
  if (!produtoId) {
    alert('Erro: Produto não identificado!');
    return;
  }
  
  // Cria o objeto do produto com os dados da página
  const produto = {
    id: produtoId,
    nome: document.getElementById('produto-nome').textContent,
    descricao: document.getElementById('produto-descricao').textContent,
    cor: document.getElementById('produto-cor').textContent,
    categoria: document.getElementById('produto-categoria').textContent,
    imagem: document.getElementById('produto-imagem').src,
    preco: extrairPreco(),
    disponibilidade: document.getElementById('produto-disponibilidade').textContent,
    areaEnvio: document.getElementById('produto-areaEnvio').textContent,
    frete: document.getElementById('produto-frete').textContent
  };
  
  // Adiciona ao carrinho
  adicionarAoCarrinho(produto);
  
  // Mostra mensagem de sucesso
  mostrarMensagemSucesso();
  
  // Redireciona para a página do carrinho após 1 segundo
  setTimeout(() => {
    window.location.href = 'carrinho';
  }, 1000);
}

/**
 * Extrai o preço do produto da página
 * @returns {number} Preço do produto
 */
function extrairPreco() {
  const precoElement = document.querySelector('.new-price span');
  if (precoElement) {
    // Remove "R$" e espaços, substitui vírgula por ponto
    const precoTexto = precoElement.textContent
      .replace('R$', '')
      .replace(/\s/g, '')
      .replace(',', '.');
    return parseFloat(precoTexto) || 0;
  }
  return 0;
}

/**
 * Mostra mensagem de sucesso ao adicionar ao carrinho
 */
function mostrarMensagemSucesso() {
  // Verifica se já existe um elemento de mensagem
  let mensagem = document.getElementById('mensagem-carrinho');
  
  if (!mensagem) {
    // Cria o elemento de mensagem
    mensagem = document.createElement('div');
    mensagem.id = 'mensagem-carrinho';
    mensagem.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background-color: #4CAF50;
      color: white;
      padding: 15px 25px;
      border-radius: 5px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      z-index: 10000;
      font-family: 'Poppins', sans-serif;
      font-weight: 500;
      animation: slideIn 0.3s ease-out;
    `;
    document.body.appendChild(mensagem);
    
    // Adiciona animação CSS
    if (!document.getElementById('mensagem-carrinho-style')) {
      const style = document.createElement('style');
      style.id = 'mensagem-carrinho-style';
      style.textContent = `
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }
  
  mensagem.textContent = '✓ Produto adicionado ao carrinho!';
  mensagem.style.display = 'block';
  
  // Remove a mensagem após 3 segundos
  setTimeout(() => {
    mensagem.style.display = 'none';
  }, 3000);
}

// ========================================
// INICIALIZAÇÃO
// ========================================

// Aguarda o carregamento completo da página
document.addEventListener('DOMContentLoaded', function() {
  // Adiciona o evento de clique ao botão comprar
  const botaoComprar = document.getElementById('botao-comprar');
  
  if (botaoComprar) {
    botaoComprar.addEventListener('click', comprarProduto);
  }
  
  // Atualiza o contador do carrinho ao carregar a página
  atualizarContadorCarrinho();
});


