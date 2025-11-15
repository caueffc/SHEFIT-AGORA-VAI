async function exibirProduto() {
  // Pega o id da URL
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  // Carrega o JSON
  const produtos = await carregarProdutos();
  const produto = produtos.find(p => p.id == id);

  if (produto) {
    // Preenche as informações do produto
    document.getElementById("produto-nome").textContent = produto.nome;
    document.getElementById("produto-descricao").textContent = produto.descricao;
    document.getElementById("produto-cor").textContent = produto.cor;
    document.getElementById("produto-categoria").textContent = produto.categoria;
    document.getElementById("produto-disponibilidade").textContent = produto.disponibilidade;
    document.getElementById("produto-areaEnvio").textContent = produto.areaEnvio;
    document.getElementById("produto-frete").textContent = produto.frete;

    // Preços
    document.querySelector(".last-price span").textContent = 
      "R$ " + produto.precoAntigo.toFixed(2);
    document.querySelector(".new-price span").textContent = 
      "R$ " + produto.preco.toFixed(2);

    // Imagem
    const imagem = document.getElementById("produto-imagem");
    imagem.src = "../" + produto.imagem;
    imagem.alt = produto.nome;

    // Avaliação
    document.getElementById("produto-avaliacao").textContent = produto.avaliacao;

  } else {
    document.querySelector(".produto-container").innerHTML = "<h1>Produto não encontrado!</h1>";
  }
}

async function carregarProdutos() {
  const resposta = await fetch("../data/produtos.json");
  return await resposta.json();
}

// Executa ao carregar
exibirProduto();