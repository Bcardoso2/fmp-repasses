const express = require('express');
const router = express.Router();
const ClienteController = require('../controllers/clienteController');

// GET /api/clientes - Listar todos os clientes
router.get('/', ClienteController.index);

// POST /api/clientes - Buscar ou criar cliente
router.post('/', ClienteController.findOrCreate);

// GET /api/clientes/:cpf_cnpj - Buscar cliente por CPF/CNPJ
router.get('/:cpf_cnpj', ClienteController.findByCpfCnpj);

module.exports = router;