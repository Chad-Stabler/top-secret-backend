const pool = require('../utils/pool');

class User {
  id;
  email;
  #password_hash;

  constructor(row) {
    this.id = row.id;
    this.email = row.email;
    this.#password_hash = row.password_hash;
  }

  static async insert({ email, password_hash }) {
    const { rows } = await pool.query(`
    insert into users (email, password_hash) values ($1, $2) returning *`, [email, password_hash]);
    return new User(rows[0]);
  }

  static async getByEmail(email) {
    const { rows } = await pool.query('select * from users where email = $1', [email]);
    return new User(rows[0]);
  }

  get password_hash() {
    return this.#password_hash;
  }
}

module.exports = User;
