-- ============================================
-- SHEFIT E-COMMERCE - INSERIR PRODUTOS
-- ============================================

USE shefit_ecommerce;

-- Limpar tabela de produtos (cuidado em produção!)
TRUNCATE TABLE products;

-- Inserir produtos
INSERT INTO products (id, name, description, price, original_price, image, color, category, availability, shipping_area, shipping_cost, rating) VALUES
(1, 'Conjunto SparkFit Azul Mesclado', 'Conjunto fitness em tecido mesclado azul com efeito brilhoso. Composto por top reforçado e short de cintura alta, garante conforto, sustentação e um caimento perfeito para valorizar o corpo. Ideal para treinos intensos ou para um look esportivo cheio de atitude.', 139.90, 169.90, 'img/verde3.png', 'Azul mesclado com brilho', 'Combo Fitness', 'Em estoque', 'Todo o Brasil', 'Grátis', '5.0 (81 avaliações)'),

(2, 'Conjunto BronzeFlex Marrom Metalizado', 'Conjunto fitness com acabamento acetinado em tom marrom bronze. Composto por top de alcinhas e legging de cintura alta, oferece compressão leve, conforto e muito estilo. Ideal para treinos ou para compor looks fitness fashion no dia a dia.', 159.90, 189.90, 'img/produto12.png', 'Marrom metalizado', 'Combo Fitness', 'Em estoque', 'Todo o Brasil', 'Grátis', '4.9 (70 avaliações)'),

(3, 'Conjunto SheFit Rosa', 'Conjunto fitness rosa com top e legging de alta compressão.', 89.90, 109.90, 'img/rosa3.png', 'Rosa', 'Combo Fitness', 'Em estoque', 'Todo o Brasil', 'Grátis', '4.8 (53 avaliações)'),

(4, 'Macacão ActiveShape Verde Menta', 'Macacão fitness texturizado em verde menta com decote em V e modelagem que realça as curvas. O tecido elástico garante conforto, compressão ideal e liberdade total de movimento. Perfeito para quem busca praticidade e estilo em um só look, seja na academia ou no dia a dia.', 169.90, 199.90, 'img/verde1.png', 'Verde Menta', 'Combo Fitness', 'Em estoque', 'Todo o Brasil', 'Grátis', '4.5 (52 avaliações)'),

(5, 'Conjunto StrongFit Vinho', 'Conjunto fitness em tom vinho, composto por top estampado com detalhe em nó frontal e legging texturizada de cintura alta. O tecido firme e confortável garante sustentação e liberdade de movimento. Ideal para treinos intensos ou para compor looks modernos no dia a dia.', 149.90, 179.90, 'img/verme2.png', 'Vinho com estampa mesclada', 'Combo Fitness', 'Em estoque', 'Todo o Brasil', 'Grátis', '4.4 (54 avaliações)'),

(6, 'Conjunto ActiveVibe Verde Menta', 'Conjunto fitness texturizado em verde menta, composto por top com bojo e short de cintura alta. O tecido ajusta-se perfeitamente ao corpo, valorizando as curvas e oferecendo conforto total para treinos de alta intensidade. Ideal para quem busca energia e estilo em cada movimento.', 139.90, 169.90, 'img/verdetop1.png', 'Verde Menta', 'Combo Fitness', 'Esgotado', 'Todo o Brasil', 'Grátis', '4.6 (61 avaliações)'),

(7, 'Conjunto PowerMove Coral', 'Conjunto fitness moderno composto por top com bojo estruturado e legging com estampa lateral "Move On". O tecido elástico garante conforto, firmeza e liberdade de movimento, ideal para treinos funcionais ou corridas ao ar livre. Destaque para o top coral vibrante que traz energia e estilo ao look.', 159.90, 189.90, 'img/rosa e branco.png', 'Coral com legging branca estampada', 'Combo Fitness', 'Em estoque', 'Todo o Brasil', 'Grátis', '4.3 (79 avaliações)'),

(8, 'Conjunto GlowBody Lilás Texturizado', 'Conjunto fitness texturizado em tom lilás, composto por top com bojo e legging de cintura alta. O tecido elástico e modelador garante conforto, sustentação e valorização das curvas durante o treino. Ideal para quem busca estilo e liberdade de movimento.', 149.90, 179.90, 'img/rosa22.png', 'Lilás', 'Combo Fitness', 'Em estoque', 'Todo o Brasil', 'Grátis', '4.8 (53 avaliações)'),

(9, 'Conjunto WaveFit Azul Marinho', 'Conjunto fitness texturizado composto por top com bojo e short de cintura alta. Modelagem que garante conforto, sustentação e realce das curvas. Ideal para treinos intensos ou uso casual.', 139.90, 169.90, 'img/zuzin2.png', 'Azul marinho', 'Combo Fitness', 'Em estoque', 'Todo o Brasil', 'Grátis', '4.9 (57 avaliações)'),

(10, 'Conjunto WaveFit Bege Texturizado', 'Conjunto fitness texturizado composto por top com bojo e legging de cintura alta. O tecido com efeito "empina bumbum" valoriza as curvas e oferece conforto e elasticidade ideais para qualquer tipo de treino. Perfeito para quem busca estilo e desempenho na academia ou no dia a dia.', 149.90, 179.90, 'img/marrom e branco.png', 'Bege claro com detalhes em branco', 'Combo Fitness', 'Esgotado', 'Todo o Brasil', 'Grátis', '4.5 (43 avaliações)'),

(11, 'Conjunto FitStyle Roxo Texturizado', 'Conjunto fitness texturizado com top estampado e legging roxa de cós alto. Tecido confortável e modelagem que valoriza o corpo com estilo e firmeza.', 159.90, 189.90, 'img/shefit1.png', 'Roxo com detalhes estampados', 'Conjuntos Fitness', 'Em estoque', 'Todo o Brasil', 'Grátis', '4.8 (53 avaliações)'),

(12, 'Combo GlamFit Black & Nude', 'Conjunto fitness moderno e confortável. Legging texturizada com detalhe nude e top combinando para um visual elegante e marcante.', 169.90, 199.90, 'img/shefit2.png', 'Preto com detalhes em nude', 'Conjuntos Fitness', 'Em estoque', 'Todo o Brasil', 'Grátis', '4.7 (30 avaliações)'),

(13, 'Macaquinho Fitness SkyFit Azul', 'Macaquinho fitness com alças finas e detalhe cruzado nas costas. Tecido leve, confortável e com excelente elasticidade, ideal para treinos ou uso casual.', 119.90, 149.90, 'img/shefit3.png', 'Azul', 'Macaquinho Fitness', 'Esgotado', 'Todo o Brasil', 'Grátis', '4.9 (50 avaliações)'),

(14, 'Macaquinho Texturizado WineFit Marsala', 'Macaquinho fitness texturizado de um ombro só, com modelagem que realça o corpo e garante conforto total. Ideal para treinos e looks casuais estilosos.', 124.90, 159.90, 'img/shefit4.png', 'Marsala', 'Macaquinho Fitness', 'Em estoque', 'Todo o Brasil', 'Grátis', '4.5 (46 avaliações)');

-- Verificar inserção
SELECT COUNT(*) as total_produtos FROM products;
SELECT * FROM products ORDER BY id;
