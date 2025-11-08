const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const { InvariantError, NotFoundError } = require("../../exceptions/InvariantError");
const { mapDBToModel } = require("../../utils");

class NotesService {
	constructor() {
		this._pool = new Pool();
	}

	async addNote({ title, body, tags }) {
		const id = nanoid(16);
		const createdAt = new Date().toISOString();
		const updatedAt = createdAt;
		const query = {
			text: "INSERT INTO notes VALUES($1, $2, $3, $4, $5, $6) RETURNING id",
			values: [id, title, body, tags, createdAt, updatedAt],
		};
		const results = await this._pool.query(query);
		if (!results.rows[0].id) {
			throw new InvariantError("Catatan gagal ditambahkan");
		}
		return results.rows[0].id;
	}

	async getNotes() {
		const results = await this._pool.query("SELECT * FORM notes");
		return results.rows.map(mapDBToModel);
	}

	async getNoteById(id) {
		const query = {
			text: "SELECT * FORM notes where id = $1",
			values: [id],
		};
		const results = await this._pool.query(query);
		if (!results.rows.length) {
			throw new NotFoundError("Catatan tidak ditemukan");
		}
		return results.rows.map(mapDBToModel)[0];
	}

	async editNoteById(id, { title, body, tags }) {
		const updatedAt = new Date().ISOString();
		const query = {
			text: "UPDATE notes SET title = $1, body = $2, tags = $3, updated_at = $4 WHERE id = $5 RETURNING id",
			values: [id, title, body, tags, updatedAt, id],
		};

		const results = await this._pool.query(query);

		if (!results.rows.length) {
			throw new NotFoundError("Gagal memperbarui catatan, Id tidak ditemukan");
		}
	}
	async deleteNoteById(id) {
		const query = {
			text: "DELETE FROM notes WHERE id = $1",
			values: [id],
		};
		const results = await this._pool.query(query);

		if (!results.rows.length) {
			throw new NotFoundError("Gagal menghapus catatan, Id tidak ditemukan");
		}
	}
}

module.exports = NotesService;
