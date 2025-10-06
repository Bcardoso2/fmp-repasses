const Agendamento = require('../models/Agendamento');
const Cliente = require('../models/Cliente');

class AgendamentoController {
  // Listar todos os agendamentos
  static async index(req, res) {
    try {
      const agendamentos = await Agendamento.findAll();
      res.json(agendamentos);
    } catch (error) {
      console.error('Erro ao listar agendamentos:', error);
      res.status(500).json({ error: 'Erro ao listar agendamentos', details: error.message });
    }
  }

  // Criar novo agendamento
  static async create(req, res) {
    try {
      const { 
        veiculo_id, 
        cliente_dados, 
        data_retirada, 
        hora_retirada, 
        valor_final, 
        observacoes 
      } = req.body;

      // Validações
      if (!veiculo_id || !cliente_dados || !data_retirada || !hora_retirada) {
        return res.status(400).json({ 
          error: 'Veículo, dados do cliente, data e hora são obrigatórios' 
        });
      }

      // Busca ou cria o cliente
      const cliente = await Cliente.findOrCreate(cliente_dados);

      // Cria o agendamento
      const agendamento = await Agendamento.create(
        veiculo_id,
        cliente.id,
        data_retirada,
        hora_retirada,
        valor_final,
        observacoes
      );

      res.status(201).json(agendamento);
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      res.status(500).json({ error: 'Erro ao criar agendamento', details: error.message });
    }
  }

  // Buscar agendamentos de um veículo
  static async findByVeiculo(req, res) {
    try {
      const { veiculo_id } = req.params;
      const agendamentos = await Agendamento.findByVeiculoId(veiculo_id);
      res.json(agendamentos);
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
      res.status(500).json({ error: 'Erro ao buscar agendamentos', details: error.message });
    }
  }

  // Upload de CRLV
  static async uploadCRLV(req, res) {
    try {
      const { id } = req.params;

      if (!req.file) {
        return res.status(400).json({ error: 'Nenhum arquivo foi enviado' });
      }

      const crlv_path = req.file.path;
      const agendamento = await Agendamento.updateCRLV(id, crlv_path);

      if (!agendamento) {
        return res.status(404).json({ error: 'Agendamento não encontrado' });
      }

      res.json({ 
        message: 'CRLV anexado com sucesso', 
        agendamento,
        file_path: crlv_path 
      });
    } catch (error) {
      console.error('Erro ao fazer upload do CRLV:', error);
      res.status(500).json({ error: 'Erro ao anexar CRLV', details: error.message });
    }
  }

  // Atualizar status dos documentos
  static async updateDocumentos(req, res) {
    try {
      const { id } = req.params;
      const { documentos_entregues } = req.body;

      if (typeof documentos_entregues !== 'boolean') {
        return res.status(400).json({ error: 'documentos_entregues deve ser true ou false' });
      }

      const agendamento = await Agendamento.updateDocumentosEntregues(id, documentos_entregues);

      if (!agendamento) {
        return res.status(404).json({ error: 'Agendamento não encontrado' });
      }

      res.json(agendamento);
    } catch (error) {
      console.error('Erro ao atualizar documentos:', error);
      res.status(500).json({ error: 'Erro ao atualizar documentos', details: error.message });
    }
  }
}

module.exports = AgendamentoController;