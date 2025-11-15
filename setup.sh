#!/bin/bash

# Script de configuração rápida do SheFit E-commerce
# Execute com: bash setup.sh

echo "🛍️  SheFit E-commerce - Setup Automático"
echo "=========================================="
echo ""

# Verificar se o MySQL está instalado
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL não encontrado. Por favor, instale o MySQL primeiro."
    echo "   Visite: https://dev.mysql.com/downloads/"
    exit 1
fi

echo "✅ MySQL encontrado"
echo ""

# Solicitar senha do MySQL
read -sp "Digite a senha do usuário root do MySQL: " MYSQL_PASSWORD
echo ""
echo ""

# Testar conexão
echo "🔄 Testando conexão com o MySQL..."
if mysql -u root -p"$MYSQL_PASSWORD" -e "SELECT 1" &> /dev/null; then
    echo "✅ Conexão bem-sucedida"
else
    echo "❌ Erro ao conectar. Verifique a senha."
    exit 1
fi

echo ""

# Criar banco de dados
echo "🔄 Criando banco de dados..."
mysql -u root -p"$MYSQL_PASSWORD" < database/schema.sql
if [ $? -eq 0 ]; then
    echo "✅ Banco de dados criado"
else
    echo "❌ Erro ao criar banco de dados"
    exit 1
fi

echo ""

# Inserir produtos
echo "🔄 Inserindo produtos..."
mysql -u root -p"$MYSQL_PASSWORD" shefit_ecommerce < database/seed_products.sql
if [ $? -eq 0 ]; then
    echo "✅ Produtos inseridos"
else
    echo "❌ Erro ao inserir produtos"
    exit 1
fi

echo ""

# Atualizar arquivo .env
echo "🔄 Configurando arquivo .env..."
sed -i "s/DB_PASSWORD=.*/DB_PASSWORD=$MYSQL_PASSWORD/" .env
echo "✅ Arquivo .env configurado"

echo ""

# Instalar dependências
echo "🔄 Instalando dependências..."
npm install
if [ $? -eq 0 ]; then
    echo "✅ Dependências instaladas"
else
    echo "❌ Erro ao instalar dependências"
    exit 1
fi

echo ""

# Testar conexão
echo "🔄 Testando conexão com o banco..."
node database/test_connection.js

echo ""
echo "=========================================="
echo "✅ Setup concluído com sucesso!"
echo ""
echo "Para iniciar o servidor, execute:"
echo "   npm start"
echo ""
echo "Ou para modo desenvolvimento:"
echo "   npm run dev"
echo ""
echo "Acesse: http://localhost:3000"
echo "=========================================="
