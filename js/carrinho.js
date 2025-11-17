// ========================================
// FUNÇÕES DE GERENCIAMENTO DO CARRINHO (API-BASED)
// ========================================

// Padrão Singleton para o Gerenciador de Carrinho (opcional, mas bom para arquitetura)
const CarrinhoManager = (function() {
    let instance;

    function init() {
        /**
         * Obtém o ID do usuário logado do localStorage
         * @returns {number|null} ID do usuário ou null
         */
        function getUserId() {
            const user = JSON.parse(localStorage.getItem('user'));
            return user ? user.id : null;
        }

        /**
         * Busca os itens do carrinho do usuário no backend
         * @returns {Promise<Array>} Array com os itens do carrinho
         */
       // ...
        async function obterCarrinho() {
            const userId = getUserId();
            if (!userId) {
                console.warn('Usuário não logado. Não é possível obter o carrinho.');
                return [];
            }

            try {
                const response = await fetch(`/api/cart/${userId}`);
                const data = await response.json();
                if (data.success && data.data && data.data.items) {
                    return data.data.items; // <-- CORREÇÃO AQUI: Acessa o array de itens
                } else {
                    console.error('Erro ao obter carrinho:', data.error);
                    return [];
                }
            } catch (error) {
                console.error('Erro de conexão ao obter carrinho:', error);
                return [];
            }
        }
// ...

        /**
         * Atualiza a quantidade de um item no carrinho
         * @param {number} itemId - ID do item no carrinho (não do produto)
         * @param {number} novaQuantidade - Nova quantidade
         */
        async function atualizarQuantidade(itemId, novaQuantidade) {
            if (novaQuantidade <= 0) {
                return removerDoCarrinho(itemId);
            }

            try {
                const response = await fetch(`/api/cart/update/${itemId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ quantity: novaQuantidade }),
                });
                const data = await response.json();
                if (!data.success) {
                    console.error('Erro ao atualizar quantidade:', data.error);
                }
            } catch (error) {
                console.error('Erro de conexão ao atualizar quantidade:', error);
            }
        }

        /**
         * Remove um item do carrinho
         * @param {number} itemId - ID do item no carrinho (não do produto)
         */
        async function removerDoCarrinho(itemId) {
            try {
                const response = await fetch(`/api/cart/remove/${itemId}`, {
                    method: 'DELETE',
                });
                const data = await response.json();
                if (!data.success) {
                    console.error('Erro ao remover item:', data.error);
                }
            } catch (error) {
                console.error('Erro de conexão ao remover item:', error);
            }
        }

        /**
         * Calcula o total do carrinho
         * @returns {Promise<number>} Valor total do carrinho
         */
        async function calcularTotal() {
            const carrinho = await obterCarrinho();
            return carrinho.reduce((total, item) => {
                const preco = parseFloat(item.price) || 0;
                return total + (preco * item.quantity);
            }, 0);
        }

        /**
         * Atualiza o contador visual do carrinho (badge)
         */
        async function atualizarContadorCarrinho() {
            const carrinho = await obterCarrinho();
            const totalItens = carrinho.reduce((total, item) => total + item.quantity, 0);
            
            // Procura por um elemento com id "carrinho-contador" e atualiza
            const contador = document.getElementById('carrinho-contador');
            if (contador) {
                contador.textContent = totalItens;
                contador.style.display = totalItens > 0 ? 'inline' : 'none';
            }
        }

        return {
            obterCarrinho,
            atualizarQuantidade,
            removerDoCarrinho,
            calcularTotal,
            atualizarContadorCarrinho,
            getUserId // Expor para uso externo se necessário
        };
    }

    return {
        // Método para obter a instância única (Singleton)
        getInstance: function() {
            if (!instance) {
                instance = init();
            }
            return instance;
        }
    };
})();

// Exporta as funções do Singleton para uso global
const carrinhoManager = CarrinhoManager.getInstance();

// Exporta as funções para que possam ser usadas no HTML e em outros scripts
window.obterCarrinho = carrinhoManager.obterCarrinho;
window.atualizarQuantidade = carrinhoManager.atualizarQuantidade;
window.removerDoCarrinho = carrinhoManager.removerDoCarrinho;
window.calcularTotal = carrinhoManager.calcularTotal;
window.atualizarContadorCarrinho = carrinhoManager.atualizarContadorCarrinho;
window.getUserId = carrinhoManager.getUserId;

