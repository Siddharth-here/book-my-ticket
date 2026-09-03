
import { pool } from "../db/pool.js";

export const getSeats = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM seats ORDER BY id ASC");
    return res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: { message: "Database error" } });
  }
};

export const bookSeat = async (req, res) => {
  const id = req.params.id;
  const name = req.user?.name || req.params.name;
  const userId = req.user.userId;

  const conn = await pool.connect();
  try {
    await conn.query("BEGIN");

    const sql = "SELECT * FROM seats WHERE id = $1 AND isbooked = 0 FOR UPDATE";
    const result = await conn.query(sql, [id]);

    if (result.rowCount === 0) {
      await conn.query("ROLLBACK");
      conn.release();
      return res.status(409).json({ error: { message: "Seat already booked" } });
    }

    const sqlU = "UPDATE seats SET isbooked = 1, name = $2, user_id = $3 WHERE id = $1 RETURNING *";
    const updateResult = await conn.query(sqlU, [id, name, userId]);

    await conn.query("COMMIT");
    conn.release();

    return res.status(200).json({
      message: "Seat successfully booked",
      seat: updateResult.rows[0]
    });
  } catch (ex) {
    await conn.query("ROLLBACK");
    conn.release();
    console.error(ex);
    return res.status(500).json({ error: { message: "Booking transaction failed" } });
  }
};