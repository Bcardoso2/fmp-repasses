const express = require('express');
const router = express.Router();
const VeiculoController = require('../controllers/veiculoController');

// GET /api/veiculos - Listar todos os veículos
router.get('/', VeiculoController.index);

// GET /api/veiculos/:id - Buscar veículo por ID
router.get('/:id', VeiculoController.show);

// POST /api/veiculos - Criar novo veículo
router.post('/', VeiculoController.create);

// PUT /api/veiculos/:id/status - Atualizar status do veículo
router.put('/:id/status', VeiculoController.updateStatus);

// DELETE /api/veiculos/:id - Deletar veículo
router.delete('/:id', VeiculoController.delete);

module.exports = router;