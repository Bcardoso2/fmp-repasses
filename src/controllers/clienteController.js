const Cliente = require('../models/Cliente');

class ClienteController {
  // Listar todos os clientes
  static async index(req, res) {
    try {
      const clientes = await Cliente.findAll();
      res.json(clientes);
    } catch (error) {
      console.error('Erro ao listar clientes:', error);
      res.status(500).json({ error: 'Erro ao listar clientes', details: error.message });
    }
  }

  // Buscar ou criar cliente
  static async findOrCreate(req, res) {
    try {
      const { nome, cpf_cnpj, tipo, telefone, email } = req.body;

      // Validações
      if (!nome || !cpf_cnpj || !tipo) {
        return res.status(400).json({ error: 'Nome, CPF/CNPJ e tipo são obrigatórios' });
      }

      const cliente = await Cliente.findOrCreate({ nome, cpf_cnpj, tipo, telefone, email });
      res.json(cliente);
    } catch (error) {
      console.error('Erro ao buscar/criar cliente:', error);
      res.status(500).json({ error: 'Erro ao processar cliente', details: error.message });
    }
  }

  // Buscar cliente por CPF/CNPJ
  static async findByCpfCnpj(req, res) {
    try {
      const { cpf_cnpj } = req.params;
      const cliente = await Cliente.findByCpfCnpj(cpf_cnpj);
      
      if (!cliente) {
        return res.status(404).json({ error: 'Cliente não encontrado' });
      }
      
      res.json(cliente);
    } catch (error) {
      console.error('Erro ao buscar cliente:', error);
      res.status(500).json({ error: 'Erro ao buscar cliente', details: error.message });
    }
  }
}

module.exports = ClienteController;