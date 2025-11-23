const db = require("../config/database.config");

const RegionService = {
  getAllRegion: async () => {
    const [rows] = await db.query(`
            select
                id,
                code,
                name,
                shipping_fee,
                note
            from regions`);
    return rows;
  },
  getByIdRegion: async (id) => {
    const [rows] = await db.query(
      `
        select
            id,
            code,
            name,
            shipping_fee,
            note
        from regions 
        where id = ?`,
      id
    );
    return rows;
  },
  createRegion: async (region) => {
    const { code, name, shipping_fee, note } = region;
    const [result] = await db.query(
      `
      INSERT INTO regions (code, name, shipping_fee, note)
      VALUES (?, ?, ?, ?)`,
      [code, name, shipping_fee, note]
    );
    return { id: result.insertId, ...region };
  },
  updateRegion: async (id, region) => {
    const { code, name, shipping_fee, note } = region;
    const [result] = await db.query(
      `
      UPDATE regions
      SET code = ?, name = ?, shipping_fee = ?, note = ?
      WHERE id = ?`,
      [code, name, shipping_fee, note, id]
    );
    return result.affectedRows > 0;
  },
  deleteRegion: async (id) => {
    const [result] = await db.query(
      `
      DELETE FROM regions
      WHERE id = ?`,
      [id]
    );
    return result.affectedRows > 0;
  },
};

module.exports = RegionService;
