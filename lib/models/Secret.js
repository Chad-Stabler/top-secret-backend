const pool = require('../utils/pool');

class Secret {
  id;
  title;
  description;
  created_at;

  constructor(row) {
    this.id = row.id;
    this.title = row.title;
    this.description = row.description;
    this.created_at = row.created_at;
  }

  static async getSecrets() {
    const { rows } = await pool.query('select * from secrets;');
    if (!rows) return({ message: 'No secrets currently' });
    return rows.map(row => new Secret(row));
  }

  static async insert(secret) {
    const { rows } = await pool.query('insert into secrets (title, description) values ($1, $2) returning*;', [secret.title, secret.description]);
    return new Secret(rows[0]);
  }
}

module.exports = Secret;
