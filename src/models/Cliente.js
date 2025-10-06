const pool = require('../config/database');

class Cliente {
  static async findByCpfCnpj(cpf_cnpj) {
    const result = await pool.query(
      'SELECT * FROM clientes WHERE cpf_cnpj = $1', 
      [cpf_cnpj]
    );
    return result.rows[0];
  }

  static async create(nome, cpf_cnpj, tipo, telefone, email) {
    const query = `
      INSERT INTO clientes (nome, cpf_cnpj, tipo, telefone, email) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING *
    `;
    const result = await pool.query(query, [nome, cpf_cnpj, tipo, telefone, email]);
    return result.rows[0];
  }

  static async findOrCreate(dados) {
    const { nome, cpf_cnpj, tipo, telefone, email } = dados;
    
    let cliente = await this.findByCpfCnpj(cpf_cnpj);
    
    if (!cliente) {
      cliente = await this.create(nome, cpf_cnpj, tipo, telefone, email);
    } else {
      // Atualiza dados do cliente se já existe
      const query = `
        UPDATE clientes 
        SET nome = $1, tipo = $2, telefone = $3, email = $4
        WHERE cpf_cnpj = $5
        RETURNING *
      `;
      const result = await pool.query(query, [nome, tipo, telefone, email, cpf_cnpj]);
      cliente = result.rows[0];
    }
    
    return cliente;
  }

  static async findAll() {
    const result = await pool.query('SELECT * FROM clientes ORDER BY created_at DESC');
    return result.rows;
  }
}

module.exports = Cliente;