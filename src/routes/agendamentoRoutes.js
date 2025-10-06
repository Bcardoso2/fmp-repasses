const express = require('express');
const router = express.Router();
const AgendamentoController = require('../controllers/agendamentoController');
const upload = require('../middleware/upload');

// GET /api/agendamentos - Listar todos os agendamentos
router.get('/', AgendamentoController.index);

// POST /api/agendamentos - Criar novo agendamento
router.post('/', AgendamentoController.create);

// GET /api/agendamentos/veiculo/:veiculo_id - Buscar agendamentos de um veículo
router.get('/veiculo/:veiculo_id', AgendamentoController.findByVeiculo);

// POST /api/agendamentos/:id/crlv - Upload do CRLV
router.post('/:id/crlv', upload.single('crlv'), AgendamentoController.uploadCRLV);

// PUT /api/agendamentos/:id/documentos - Atualizar status dos documentos
router.put('/:id/documentos', AgendamentoController.updateDocumentos);

module.exports = router;