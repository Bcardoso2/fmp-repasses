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

// CORS - PERMITIR NETLIFY (ANTES DE TUDO!)
app.use(cors({
  origin: function (origin, callback) {
    // Permitir requisições sem origin (mobile apps, Postman, etc)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://controle-fmprepasses.netlify.app'
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, true); // Permitir temporariamente todas as origens para debug
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log de todas as requisições para debug
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

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
      agendamentos: '/api/agendamentos',
      cron: '/api/cron'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ✨ ROTA PARA CRON-JOB
app.get('/api/cron', async (req, res) => {
  try {
    console.log('🕐 Cron-job executado em:', new Date().toISOString());
    
    // Aqui você pode adicionar a lógica que deseja executar
    // Por exemplo:
    // - Verificar agendamentos vencidos
    // - Enviar notificações
    // - Limpar dados antigos
    // - Fazer backup
    // - Etc.
    
    // Exemplo de lógica:
    // const resultado = await algumProcessamento();
    
    res.status(200).json({ 
      success: true,
      message: 'Cron-job executado com sucesso',
      timestamp: new Date().toISOString(),
      // data: resultado // Se quiser retornar dados
    });
    
  } catch (error) {
    console.error('❌ Erro no cron-job:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erro ao executar cron-job',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Tratamento de erros 404
app.use((req, res) => {
  console.log('404 - Rota não encontrada:', req.path);
  res.status(404).json({ error: 'Rota não encontrada', path: req.path });
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
  console.log(`📍 http://0.0.0.0:${PORT}`);
  console.log(`🌍 Acesse: http://localhost:${PORT}`);
  console.log(`⏰ Rota cron: http://localhost:${PORT}/api/cron`);
});

module.exports = app;
