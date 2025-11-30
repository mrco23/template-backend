const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../exceptions/InvariantError");
const NotFoundError = require("../exceptions/NotFoundError");
const AuthenticationsError = require("./AuthenticationsService");

class UsersService {
	constructor() {
		this._pool = new Pool();
	}

	async addUser({ username, password, fullName }) {
		// TODO: Verifikasi username, pastikan belum terdaftar.
		await this.verifyNewUsername(username);
		// TODO: Bila verifikasi lolos, maka masukkan user baru ke database.
		const id = `user-${nanoid(16)}`;
		const hashedPassword = await bcrypt.hash(password, 10);

		const query = {
			text: "INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id",
			values: [id, username, hashedPassword, fullName],
		};

		const result = await this._pool.query(query);

		if (!result.rows.length) {
			throw new InvariantError("user gagal ditambahkan");
		}

		return result.rows[0].id;
	}

	async verifyNewUsername(username) {
		const query = {
			text: "SELECT * FROM users WHERE username = $1",
			values: [username],
		};

		const result = await this._pool.query(query);

		if (result.rows > 0) {
			throw new InvariantError("Username sudah digunakan.");
		}
	}

	async getUserById(userId) {
		const query = {
			text: "SELECT * FROM users WHERE id = $1",
			values: [userId],
		};

		const result = await this._pool.query(query);

		if (!result.rows.length) {
			throw new NotFoundError("user tidak ada.");
		}

		return result.rows[0];
	}
	async verifyUserCredential(username) {
		const query = {
			text: "SELECT id, password FROM users WHERE username = $1",
			values: [username],
		};

		const result = await this._pool.query(query);
		if (!result.rows.length) {
			throw new AuthenticationsError("Kredensial yang Anda berikan salah");
		}

		const { id, password, hashedPassword } = result.rows[0];
		const match = await bcrypt.compare(password, hashedPassword);
		if (!match) throw new AuthenticationsError("Kredensial yang Anda berikan salah");
		return id;
	}
}

module.exports = UsersService;
