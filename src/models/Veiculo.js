const pool = require('../config/database');

class Veiculo {
  static async findAll() {
    const query = `
      SELECT v.*, 
             c.nome as cliente_nome, 
             c.cpf_cnpj,
             c.tipo as cliente_tipo,
             a.id as agendamento_id,
             a.data_retirada, 
             a.hora_retirada,
             a.crlv_anexado,
             a.crlv_path,
             a.documentos_entregues,
             a.valor_final,
             a.observacoes
      FROM veiculos v
      LEFT JOIN agendamentos a ON v.id = a.veiculo_id 
        AND a.id = (
          SELECT id FROM agendamentos 
          WHERE veiculo_id = v.id 
          ORDER BY created_at DESC 
          LIMIT 1
        )
      LEFT JOIN clientes c ON a.cliente_id = c.id
      ORDER BY v.created_at DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  static async findById(id) {
    const result = await pool.query('SELECT * FROM veiculos WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async create(placa, modelo, valor_base) {
    const query = `
      INSERT INTO veiculos (placa, modelo, valor_base) 
      VALUES ($1, $2, $3) 
      RETURNING *
    `;
    const result = await pool.query(query, [placa, modelo, valor_base]);
    return result.rows[0];
  }

  static async updateStatus(id, status) {
    const query = `
      UPDATE veiculos 
      SET status = $1, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $2 
      RETURNING *
    `;
    const result = await pool.query(query, [status, id]);
    return result.rows[0];
  }

  static async delete(id) {
    await pool.query('DELETE FROM veiculos WHERE id = $1', [id]);
    return { message: 'Veículo deletado com sucesso' };
  }
}

module.exports = Veiculo;