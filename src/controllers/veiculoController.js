const Veiculo = require('../models/Veiculo');

class VeiculoController {
  // Listar todos os veículos
  static async index(req, res) {
    try {
      const veiculos = await Veiculo.findAll();
      res.json(veiculos);
    } catch (error) {
      console.error('Erro ao listar veículos:', error);
      res.status(500).json({ error: 'Erro ao listar veículos', details: error.message });
    }
  }

  // Buscar veículo por ID
  static async show(req, res) {
    try {
      const { id } = req.params;
      const veiculo = await Veiculo.findById(id);
      
      if (!veiculo) {
        return res.status(404).json({ error: 'Veículo não encontrado' });
      }
      
      res.json(veiculo);
    } catch (error) {
      console.error('Erro ao buscar veículo:', error);
      res.status(500).json({ error: 'Erro ao buscar veículo', details: error.message });
    }
  }

  // Criar novo veículo
  static async create(req, res) {
    try {
      const { placa, modelo, valor_base } = req.body;

      // Validações
      if (!placa || !modelo || !valor_base) {
        return res.status(400).json({ error: 'Placa, modelo e valor_base são obrigatórios' });
      }

      const veiculo = await Veiculo.create(placa, modelo, valor_base);
      res.status(201).json(veiculo);
    } catch (error) {
      console.error('Erro ao criar veículo:', error);
      
      if (error.code === '23505') { // Código de erro para duplicação no PostgreSQL
        return res.status(400).json({ error: 'Placa já cadastrada' });
      }
      
      res.status(500).json({ error: 'Erro ao criar veículo', details: error.message });
    }
  }

  // Atualizar status do veículo
  static async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ error: 'Status é obrigatório' });
      }

      const veiculo = await Veiculo.updateStatus(id, status);
      
      if (!veiculo) {
        return res.status(404).json({ error: 'Veículo não encontrado' });
      }

      res.json(veiculo);
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      res.status(500).json({ error: 'Erro ao atualizar status', details: error.message });
    }
  }

  // Deletar veículo
  static async delete(req, res) {
    try {
      const { id } = req.params;
      await Veiculo.delete(id);
      res.json({ message: 'Veículo deletado com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar veículo:', error);
      res.status(500).json({ error: 'Erro ao deletar veículo', details: error.message });
    }
  }
}

module.exports = VeiculoController;