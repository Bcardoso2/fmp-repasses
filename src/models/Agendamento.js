const pool = require('../config/database');

class Agendamento {
  static async create(veiculo_id, cliente_id, data_retirada, hora_retirada, valor_final, observacoes) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Garantir que valor_final é número
      const valorFinalNumerico = parseFloat(valor_final);
      
      // Cria o agendamento
      const agendamentoQuery = `
        INSERT INTO agendamentos 
        (veiculo_id, cliente_id, data_retirada, hora_retirada, valor_final, observacoes) 
        VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING *
      `;
      const agendamentoResult = await client.query(agendamentoQuery, [
        veiculo_id, 
        cliente_id, 
        data_retirada, 
        hora_retirada, 
        valorFinalNumerico, // ✅ CORRIGIDO
        observacoes
      ]);
      
      // Atualiza status do veículo
      await client.query(
        'UPDATE veiculos SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        ['Agendado', veiculo_id]
      );
      
      await client.query('COMMIT');
      return agendamentoResult.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async findById(id) {
    const result = await pool.query('SELECT * FROM agendamentos WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async findByVeiculoId(veiculo_id) {
    const query = `
      SELECT a.*, c.nome as cliente_nome, c.cpf_cnpj, c.tipo as cliente_tipo
      FROM agendamentos a
      JOIN clientes c ON a.cliente_id = c.id
      WHERE a.veiculo_id = $1
      ORDER BY a.created_at DESC
    `;
    const result = await pool.query(query, [veiculo_id]);
    return result.rows;
  }

  static async updateCRLV(agendamento_id, crlv_path) {
    const query = `
      UPDATE agendamentos 
      SET crlv_anexado = true, crlv_path = $1, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $2 
      RETURNING *
    `;
    const result = await pool.query(query, [crlv_path, agendamento_id]);
    return result.rows[0];
  }

  static async updateDocumentosEntregues(agendamento_id, documentos_entregues) {
    const query = `
      UPDATE agendamentos 
      SET documentos_entregues = $1, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $2 
      RETURNING *
    `;
    const result = await pool.query(query, [documentos_entregues, agendamento_id]);
    return result.rows[0];
  }

  static async findAll() {
    const query = `
      SELECT a.*, 
             v.placa, v.modelo,
             c.nome as cliente_nome, c.cpf_cnpj
      FROM agendamentos a
      JOIN veiculos v ON a.veiculo_id = v.id
      JOIN clientes c ON a.cliente_id = c.id
      ORDER BY a.data_retirada DESC, a.hora_retirada DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  }
}

module.exports = Agendamento;