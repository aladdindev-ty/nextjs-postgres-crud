import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
});

export async function GET() {
  const { rows } = await pool.query("SELECT * FROM items");
  return Response.json(rows);
}

export async function POST(request) {
  const { name, description } = await request.json();
  const { rows } = await pool.query(
    "INSERT INTO items (name, description) VALUES ($1, $2) RETURNING *",
    [name, description]
  );
  return Response.json(rows[0], { status: 201 });
}

export async function PUT(request) {
  const { id, name, description } = await request.json();
  const { rows } = await pool.query(
    "UPDATE items SET name = $1, description = $2 WHERE id = $3 RETURNING *",
    [name, description, id]
  );
  return Response.json(rows[0]);
}

export async function DELETE(request) {
  const { id } = await request.json();
  await pool.query("DELETE FROM items WHERE id = $1", [id]);
  return new Response(null, { status: 204 });
}
