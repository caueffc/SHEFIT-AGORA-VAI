import pool from '../config/database.js';

async function testConnection() {
  try {
    console.log('🔄 Testando conexão com o banco de dados...\n');
    
    const connection = await pool.getConnection();
    console.log('✅ Conexão estabelecida com sucesso!\n');
    
    // Testar consulta simples
    const [rows] = await connection.query('SELECT 1 + 1 AS result');
    console.log('✅ Consulta de teste executada:', rows[0]);
    
    // Verificar tabelas
    const [tables] = await connection.query('SHOW TABLES');
    console.log('\n📋 Tabelas encontradas no banco:');
    tables.forEach(table => {
      const tableName = Object.values(table)[0];
      console.log(`   - ${tableName}`);
    });
    
    // Contar registros em cada tabela
    console.log('\n📊 Contagem de registros:');
    for (const table of tables) {
      const tableName = Object.values(table)[0];
      const [count] = await connection.query(`SELECT COUNT(*) as total FROM ${tableName}`);
      console.log(`   - ${tableName}: ${count[0].total} registros`);
    }
    
    connection.release();
    console.log('\n✅ Teste concluído com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao conectar ao banco de dados:', error.message);
    console.error('\n💡 Verifique se:');
    console.error('   1. O MySQL está rodando');
    console.error('   2. As credenciais no arquivo .env estão corretas');
    console.error('   3. O banco de dados "shefit_ecommerce" foi criado');
    process.exit(1);
  }
}

testConnection();
