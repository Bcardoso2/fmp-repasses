const { Pool } = require('pg');
require('dotenv').config();

// Configuração usando DATABASE_URL ou credenciais separadas
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Necessário para conexões externas (Render, Heroku, etc)
  }
});

// Alternativa: usar credenciais separadas (descomente se preferir)
/*
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false
  }
});
*/

// Testa a conexão
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Erro ao conectar ao banco de dados:', err.stack);
  } else {
    console.log('✅ Conectado ao PostgreSQL - Banco: fmp_repasses');
    release();
  }
});

// Tratamento de erros de conexão
pool.on('error', (err, client) => {
  console.error('❌ Erro inesperado no cliente PostgreSQL:', err);
});

module.exports = pool;