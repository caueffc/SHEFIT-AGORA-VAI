import mysql from 'mysql2/promise';
import fs from 'fs';

(async () => {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      multipleStatements: true
    });
    
    console.log('✅ Conectado ao banco!');
    
    const schema = fs.readFileSync('database/schema.sql', 'utf8');
    await conn.query(schema);
    console.log('✅ Schema criado!');
    
    const seed = fs.readFileSync('database/seed_products.sql', 'utf8');
    await conn.query(seed);
    console.log('✅ Produtos inseridos!');
    
    console.log('🎉 Banco inicializado com sucesso!');
    await conn.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
})();