# 🛍️ SheFit E-commerce

E-commerce completo desenvolvido com Node.js, Express e MySQL para venda de produtos fitness.

## 🚀 Início Rápido

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar banco de dados
```bash
# Criar banco e tabelas
mysql -u root -p < database/schema.sql

# Inserir produtos
mysql -u root -p shefit_ecommerce < database/seed_products.sql
```

### 3. Configurar variáveis de ambiente
Edite o arquivo `.env` com suas credenciais do MySQL:
```env
DB_PASSWORD=sua_senha_aqui
```

### 4. Testar conexão
```bash
node database/test_connection.js
```

### 5. Iniciar servidor
```bash
npm start
# ou para desenvolvimento com auto-reload
npm run dev
```

### 6. Acessar o site
Abra seu navegador em: http://localhost:3000

## 📚 Documentação Completa

Para instruções detalhadas passo a passo, consulte: **[GUIA_CONFIGURACAO.md](GUIA_CONFIGURACAO.md)**

## 🔑 Credenciais Padrão

**Usuário Admin:**
- Email: admin@shefit.com
- Senha: admin123

⚠️ **Altere essa senha após o primeiro login!**

## 🛠️ Tecnologias

- **Backend:** Node.js + Express
- **Banco de Dados:** MySQL
- **Autenticação:** bcrypt
- **Frontend:** HTML, CSS, JavaScript

## 📦 Estrutura do Projeto

```
shefit-nodejs/
├── config/
│   └── database.js          # Configuração do MySQL
├── database/
│   ├── schema.sql           # Criação do banco e tabelas
│   ├── seed_products.sql    # Inserção de produtos
│   └── test_connection.js   # Teste de conexão
├── routes/
│   ├── users.js             # Rotas de usuários (login/cadastro)
│   ├── products.js          # Rotas de produtos
│   ├── cart.js              # Rotas de carrinho
│   └── orders.js            # Rotas de pedidos
├── views/
│   ├── index.html           # Página inicial
│   ├── login.html           # Página de login
│   ├── cadastro.html        # Página de cadastro
│   ├── produtostela.html    # Lista de produtos
│   ├── produto.html         # Detalhes do produto
│   └── carrinho.html        # Carrinho de compras
├── css/                     # Arquivos de estilo
├── js/                      # Scripts do frontend
├── img/                     # Imagens dos produtos
├── .env                     # Variáveis de ambiente
├── server.js                # Servidor principal
└── package.json             # Dependências do projeto
```

## 🔌 APIs Principais

### Usuários
- `POST /api/users/register` - Cadastrar usuário
- `POST /api/users/login` - Fazer login
- `GET /api/users/profile/:id` - Obter perfil
- `PUT /api/users/profile/:id` - Atualizar perfil
- `PUT /api/users/change-password/:id` - Alterar senha

### Produtos
- `GET /api/products` - Listar produtos
- `GET /api/products/:id` - Obter produto
- `POST /api/products` - Criar produto
- `PUT /api/products/:id` - Atualizar produto
- `DELETE /api/products/:id` - Remover produto

### Carrinho
- `GET /api/cart/:userId` - Obter carrinho
- `POST /api/cart/add` - Adicionar item
- `PUT /api/cart/update/:cartId` - Atualizar quantidade
- `DELETE /api/cart/remove/:cartId` - Remover item
- `DELETE /api/cart/clear/:userId` - Limpar carrinho

### Pedidos
- `GET /api/orders/user/:userId` - Listar pedidos
- `GET /api/orders/:orderId` - Obter pedido
- `POST /api/orders/create` - Criar pedido
- `PUT /api/orders/status/:orderId` - Atualizar status

## 📊 Banco de Dados

O projeto inclui:
- ✅ 5 tabelas (users, products, cart, orders, order_items)
- ✅ 14 produtos pré-cadastrados
- ✅ 1 usuário admin padrão
- ✅ Relacionamentos com chaves estrangeiras
- ✅ Índices para otimização

## 🔐 Segurança

- ✅ Senhas criptografadas com bcrypt
- ✅ Validação de inputs
- ✅ Prepared statements (SQL injection protection)
- ✅ CORS configurado
- ⚠️ Para produção: implementar JWT e HTTPS

## 🐛 Solução de Problemas

**Erro de conexão com o banco?**
- Verifique se o MySQL está rodando
- Confirme as credenciais no arquivo `.env`
- Execute o teste: `node database/test_connection.js`

**Produtos não aparecem?**
- Execute: `mysql -u root -p shefit_ecommerce < database/seed_products.sql`

**Mais problemas?**
- Consulte o [GUIA_CONFIGURACAO.md](GUIA_CONFIGURACAO.md) para soluções detalhadas

## 📝 Licença

ISC

## 👨‍💻 Desenvolvimento

```bash
# Instalar dependências
npm install

# Modo desenvolvimento (com auto-reload)
npm run dev

# Modo produção
npm start
```

---

**🎉 Pronto para vender! Seu e-commerce está configurado e funcionando!**
# SHEFIT-AGORA-VAI
