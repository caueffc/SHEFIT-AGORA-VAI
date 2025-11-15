async function carregarProdutos() {
  const resposta = await fetch("../data/produtos.json");
  const produtos = await resposta.json();
  return produtos;
}