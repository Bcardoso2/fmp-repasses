const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Importar rotas
const veiculoRoutes = require('./routes/veiculoRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const agendamentoRoutes = require('./routes/agendamentoRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Configuração de CORS - PERMITE NETLIFY
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://controle-fmprepasses.netlify.app'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos (uploads)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rotas da API
app.use('/api/veiculos', veiculoRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/agendamentos', agendamentoRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.json({ 
    message: 'API FMP Repasses está rodando!',
    version: '1.0.0',
    endpoints: {
      veiculos: '/api/veiculos',
      clientes: '/api/clientes',
      agendamentos: '/api/agendamentos'
    }
  });
});

// Health check para o Render
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Tratamento de erros 404
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Tratamento de erros gerais
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  res.status(500).json({ 
    error: 'Erro interno do servidor',
    message: err.message 
  });
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`📁 Banco de dados: ${process.env.DB_NAME || 'autogiro'}`);
});

module.exports = app;
