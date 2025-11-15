# 🛍️ Guia de Configuração - SheFit E-commerce

## 📋 Índice

1. [Pré-requisitos](#pré-requisitos)
2. [Passo 1: Instalar o MySQL](#passo-1-instalar-o-mysql)
3. [Passo 2: Criar o Banco de Dados](#passo-2-criar-o-banco-de-dados)
4. [Passo 3: Inserir os Produtos](#passo-3-inserir-os-produtos)
5. [Passo 4: Configurar o Projeto](#passo-4-configurar-o-projeto)
6. [Passo 5: Testar a Conexão](#passo-5-testar-a-conexão)
7. [Passo 6: Iniciar o Servidor](#passo-6-iniciar-o-servidor)
8. [Passo 7: Testar as Funcionalidades](#passo-7-testar-as-funcionalidades)
9. [Estrutura do Banco de Dados](#estrutura-do-banco-de-dados)
10. [APIs Disponíveis](#apis-disponíveis)
11. [Solução de Problemas](#solução-de-problemas)

---

## 🔧 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 16 ou superior)
- **MySQL** (versão 5.7 ou superior)
- **npm** (geralmente vem com o Node.js)

---

## Passo 1: Instalar o MySQL

### Windows

1. Baixe o MySQL Installer em: https://dev.mysql.com/downloads/installer/
2. Execute o instalador e escolha "Developer Default"
3. Durante a instalação, defina uma senha para o usuário `root`
4. Anote essa senha, você vai precisar dela!

### macOS

```bash
# Usando Homebrew
brew install mysql

# Iniciar o MySQL
brew services start mysql

# Configurar senha do root
mysql_secure_installation
```

### Linux (Ubuntu/Debian)

```bash
# Atualizar repositórios
sudo apt update

# Instalar MySQL
sudo apt install mysql-server

# Iniciar o serviço
sudo systemctl start mysql

# Configurar segurança
sudo mysql_secure_installation
```

---

## Passo 2: Criar o Banco de Dados

### Opção A: Usando a linha de comando

1. Abra o terminal/prompt de comando

2. Acesse o MySQL:
```bash
mysql -u root -p
```

3. Digite a senha do root quando solicitado

4. Execute o script de criação:
```bash
mysql -u root -p < database/schema.sql
```

### Opção B: Usando o MySQL Workbench

1. Abra o MySQL Workbench
2. Conecte-se ao servidor MySQL
3. Abra o arquivo `database/schema.sql`
4. Clique no ícone de raio ⚡ para executar o script
5. Verifique se o banco `shefit_ecommerce` foi criado

### Opção C: Manualmente no terminal MySQL

```sql
-- Copie e cole os comandos do arquivo database/schema.sql
-- Ou execute:
SOURCE /caminho/completo/para/database/schema.sql;
```

---

## Passo 3: Inserir os Produtos

Após criar o banco de dados, insira os produtos:

```bash
mysql -u root -p shefit_ecommerce < database/seed_products.sql
```

Ou no MySQL Workbench:
1. Abra o arquivo `database/seed_products.sql`
2. Execute o script
3. Verifique se 14 produtos foram inseridos

---

## Passo 4: Configurar o Projeto

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

O arquivo `.env` já está configurado com valores padrão. Se você definiu uma senha diferente para o MySQL, edite o arquivo `.env`:

```env
# Configuração do Servidor
PORT=3000
NODE_ENV=development

# Configuração do Banco de Dados MySQL
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=SUA_SENHA_AQUI
DB_NAME=shefit_ecommerce

# CORS
CORS_ORIGIN=http://localhost:3000
```

**⚠️ IMPORTANTE:** Substitua `SUA_SENHA_AQUI` pela senha que você definiu para o usuário root do MySQL.

---

## Passo 5: Testar a Conexão

Antes de iniciar o servidor, teste se a conexão com o banco está funcionando:

```bash
node database/test_connection.js
```

**Resultado esperado:**
```
🔄 Testando conexão com o banco de dados...

✅ Conexão estabelecida com sucesso!

✅ Consulta de teste executada: { result: 2 }

📋 Tabelas encontradas no banco:
   - users
   - products
   - cart
   - orders
   - order_items

📊 Contagem de registros:
   - users: 1 registros
   - products: 14 registros
   - cart: 0 registros
   - orders: 0 registros
   - order_items: 0 registros

✅ Teste concluído com sucesso!
```

Se você vir essa mensagem, tudo está funcionando! 🎉

---

## Passo 6: Iniciar o Servidor

### Modo desenvolvimento (com auto-reload)

```bash
npm run dev
```

### Modo produção

```bash
npm start
```

**Resultado esperado:**
```
🚀 Servidor rodando em http://localhost:3000
📁 Arquivos estáticos sendo servidos de: /caminho/do/projeto
```

---

## Passo 7: Testar as Funcionalidades

### 1. Acessar o site

Abra seu navegador e acesse: http://localhost:3000

### 2. Testar o cadastro de usuário

1. Acesse: http://localhost:3000/cadastro
2. Preencha o formulário de cadastro
3. Clique em "Cadastrar"

### 3. Testar o login

1. Acesse: http://localhost:3000/login
2. Use as credenciais que você cadastrou
3. Ou use o usuário admin padrão:
   - **Email:** admin@shefit.com
   - **Senha:** admin123

### 4. Testar produtos

1. Acesse: http://localhost:3000/produtostela
2. Você deve ver os 14 produtos carregados do banco de dados

### 5. Testar carrinho

1. Clique em um produto
2. Adicione ao carrinho
3. Acesse: http://localhost:3000/carrinho

---

## 📊 Estrutura do Banco de Dados

### Tabela: `users`
Armazena informações dos usuários do sistema.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INT | ID único do usuário |
| name | VARCHAR(255) | Nome completo |
| email | VARCHAR(255) | Email (único) |
| password | VARCHAR(255) | Senha criptografada (bcrypt) |
| role | ENUM | Tipo: 'user' ou 'admin' |
| created_at | TIMESTAMP | Data de criação |
| updated_at | TIMESTAMP | Data de atualização |

### Tabela: `products`
Armazena informações dos produtos.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INT | ID único do produto |
| name | VARCHAR(255) | Nome do produto |
| description | TEXT | Descrição detalhada |
| price | DECIMAL(10,2) | Preço atual |
| original_price | DECIMAL(10,2) | Preço original |
| image | VARCHAR(500) | Caminho da imagem |
| color | VARCHAR(100) | Cor do produto |
| category | VARCHAR(100) | Categoria |
| availability | VARCHAR(50) | Disponibilidade |
| shipping_area | VARCHAR(100) | Área de envio |
| shipping_cost | VARCHAR(50) | Custo de frete |
| rating | VARCHAR(50) | Avaliação |
| created_at | TIMESTAMP | Data de criação |
| updated_at | TIMESTAMP | Data de atualização |

### Tabela: `cart`
Armazena itens no carrinho de compras.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INT | ID único do item |
| user_id | INT | ID do usuário |
| product_id | INT | ID do produto |
| quantity | INT | Quantidade |
| size | VARCHAR(10) | Tamanho |
| created_at | TIMESTAMP | Data de adição |
| updated_at | TIMESTAMP | Data de atualização |

### Tabela: `orders`
Armazena pedidos realizados.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INT | ID único do pedido |
| user_id | INT | ID do usuário |
| total_amount | DECIMAL(10,2) | Valor total |
| status | ENUM | Status do pedido |
| shipping_address | TEXT | Endereço de entrega |
| payment_method | VARCHAR(50) | Método de pagamento |
| created_at | TIMESTAMP | Data de criação |
| updated_at | TIMESTAMP | Data de atualização |

### Tabela: `order_items`
Armazena itens de cada pedido.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INT | ID único do item |
| order_id | INT | ID do pedido |
| product_id | INT | ID do produto |
| product_name | VARCHAR(255) | Nome do produto |
| product_price | DECIMAL(10,2) | Preço no momento da compra |
| quantity | INT | Quantidade |
| size | VARCHAR(10) | Tamanho |
| subtotal | DECIMAL(10,2) | Subtotal |
| created_at | TIMESTAMP | Data de criação |

---

## 🔌 APIs Disponíveis

### Usuários

#### Registrar usuário
```
POST /api/users/register
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha123"
}
```

#### Login
```
POST /api/users/login
Content-Type: application/json

{
  "email": "joao@email.com",
  "password": "senha123"
}
```

#### Obter perfil
```
GET /api/users/profile/:id
```

#### Atualizar perfil
```
PUT /api/users/profile/:id
Content-Type: application/json

{
  "name": "João Silva Santos",
  "email": "joao.novo@email.com"
}
```

#### Alterar senha
```
PUT /api/users/change-password/:id
Content-Type: application/json

{
  "currentPassword": "senha123",
  "newPassword": "novaSenha456"
}
```

---

### Produtos

#### Listar todos os produtos
```
GET /api/products
```

#### Filtrar produtos
```
GET /api/products?category=Combo%20Fitness
GET /api/products?availability=Em%20estoque
GET /api/products?search=rosa
```

#### Obter produto por ID
```
GET /api/products/:id
```

#### Listar categorias
```
GET /api/products/meta/categories
```

#### Criar produto (admin)
```
POST /api/products
Content-Type: application/json

{
  "name": "Novo Produto",
  "description": "Descrição do produto",
  "price": 99.90,
  "original_price": 129.90,
  "image": "img/produto.png",
  "color": "Azul",
  "category": "Combo Fitness",
  "availability": "Em estoque"
}
```

#### Atualizar produto (admin)
```
PUT /api/products/:id
Content-Type: application/json

{
  "price": 89.90,
  "availability": "Esgotado"
}
```

#### Remover produto (admin)
```
DELETE /api/products/:id
```

---

### Carrinho

#### Obter carrinho do usuário
```
GET /api/cart/:userId
```

#### Adicionar item ao carrinho
```
POST /api/cart/add
Content-Type: application/json

{
  "userId": 1,
  "productId": 3,
  "quantity": 2,
  "size": "M"
}
```

#### Atualizar quantidade
```
PUT /api/cart/update/:cartId
Content-Type: application/json

{
  "quantity": 3
}
```

#### Remover item
```
DELETE /api/cart/remove/:cartId
```

#### Limpar carrinho
```
DELETE /api/cart/clear/:userId
```

---

### Pedidos

#### Listar pedidos do usuário
```
GET /api/orders/user/:userId
```

#### Obter detalhes de um pedido
```
GET /api/orders/:orderId
```

#### Criar pedido
```
POST /api/orders/create
Content-Type: application/json

{
  "userId": 1,
  "items": [
    {
      "product_id": 1,
      "quantity": 2,
      "size": "M"
    }
  ],
  "shippingAddress": "Rua Exemplo, 123 - São Paulo, SP",
  "paymentMethod": "Cartão de Crédito"
}
```

#### Atualizar status do pedido (admin)
```
PUT /api/orders/status/:orderId
Content-Type: application/json

{
  "status": "shipped"
}
```

**Status válidos:** `pending`, `processing`, `shipped`, `delivered`, `cancelled`

---

## 🔧 Solução de Problemas

### Erro: "Access denied for user 'root'@'localhost'"

**Causa:** Senha incorreta no arquivo `.env`

**Solução:**
1. Abra o arquivo `.env`
2. Verifique se a senha em `DB_PASSWORD` está correta
3. Reinicie o servidor

---

### Erro: "Unknown database 'shefit_ecommerce'"

**Causa:** O banco de dados não foi criado

**Solução:**
```bash
mysql -u root -p < database/schema.sql
```

---

### Erro: "Table 'shefit_ecommerce.products' doesn't exist"

**Causa:** As tabelas não foram criadas

**Solução:**
1. Verifique se o script `schema.sql` foi executado completamente
2. Execute novamente:
```bash
mysql -u root -p shefit_ecommerce < database/schema.sql
```

---

### Erro: "Cannot find module 'bcrypt'"

**Causa:** Dependências não instaladas

**Solução:**
```bash
npm install
```

---

### Produtos não aparecem no site

**Causa:** Produtos não foram inseridos no banco

**Solução:**
```bash
mysql -u root -p shefit_ecommerce < database/seed_products.sql
```

---

### Porta 3000 já está em uso

**Causa:** Outro serviço está usando a porta 3000

**Solução:**
1. Abra o arquivo `.env`
2. Altere `PORT=3000` para `PORT=3001` (ou outra porta disponível)
3. Reinicie o servidor

---

### Login não funciona

**Causa:** Senha não está sendo criptografada corretamente

**Solução:**
1. Certifique-se de que o pacote `bcrypt` está instalado:
```bash
npm install bcrypt
```
2. Crie um novo usuário através da API de registro
3. Não use senhas criadas antes da implementação do bcrypt

---

## 🎯 Próximos Passos

Agora que seu e-commerce está configurado, você pode:

1. **Personalizar o design** - Edite os arquivos CSS em `/css`
2. **Adicionar mais produtos** - Use a API POST `/api/products`
3. **Implementar pagamento** - Integre com gateways como Stripe ou PagSeguro
4. **Adicionar autenticação JWT** - Para maior segurança
5. **Criar painel administrativo** - Para gerenciar produtos e pedidos
6. **Implementar upload de imagens** - Para adicionar fotos de produtos
7. **Adicionar envio de emails** - Para confirmação de pedidos

---

## 📞 Suporte

Se você encontrar algum problema não listado aqui, verifique:

1. Os logs do servidor no terminal
2. O console do navegador (F12)
3. Os logs do MySQL

---

## 🔐 Segurança

**⚠️ IMPORTANTE para produção:**

1. **Nunca** commite o arquivo `.env` no Git
2. Use senhas fortes para o banco de dados
3. Implemente JWT para autenticação
4. Use HTTPS em produção
5. Valide todos os inputs do usuário
6. Implemente rate limiting nas APIs
7. Faça backup regular do banco de dados

---

## ✅ Checklist de Configuração

- [ ] MySQL instalado e rodando
- [ ] Banco de dados `shefit_ecommerce` criado
- [ ] Tabelas criadas (users, products, cart, orders, order_items)
- [ ] 14 produtos inseridos
- [ ] Arquivo `.env` configurado com senha correta
- [ ] Dependências instaladas (`npm install`)
- [ ] Teste de conexão passou (`node database/test_connection.js`)
- [ ] Servidor iniciado (`npm start` ou `npm run dev`)
- [ ] Site acessível em http://localhost:3000
- [ ] Cadastro de usuário funcionando
- [ ] Login funcionando
- [ ] Produtos carregando na página

---

**🎉 Parabéns! Seu e-commerce SheFit está pronto para uso!**
