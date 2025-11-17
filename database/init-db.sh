#!/bin/bash

# Script para inicializar o banco de dados MySQL no Railway
# Este script deve ser executado após o deploy

echo "🔧 Inicializando banco de dados SheFit..."

# Verificar se as variáveis de ambiente estão configuradas
if [ -z "$DB_HOST" ] || [ -z "$DB_USER" ] || [ -z "$DB_PASSWORD" ]; then
    echo "❌ Erro: Variáveis de ambiente do banco de dados não configuradas"
    echo "Configure: DB_HOST, DB_USER, DB_PASSWORD, DB_NAME"
    exit 1
fi

DB_NAME=${DB_NAME:-railway}

echo "📊 Conectando ao banco de dados..."
echo "Host: $DB_HOST"
echo "Database: $DB_NAME"

# Executar schema
echo "📝 Criando tabelas..."
mysql -h "$DB_HOST" -P "${DB_PORT:-3306}" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < database/schema.sql

if [ $? -eq 0 ]; then
    echo "✅ Schema criado com sucesso"
else
    echo "❌ Erro ao criar schema"
    exit 1
fi

# Executar seed de produtos
echo "🌱 Inserindo produtos..."
mysql -h "$DB_HOST" -P "${DB_PORT:-3306}" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < database/seed_products.sql

if [ $? -eq 0 ]; then
    echo "✅ Produtos inseridos com sucesso"
else
    echo "❌ Erro ao inserir produtos"
    exit 1
fi

echo "🎉 Banco de dados inicializado com sucesso!"
