import pool from "../config/db.js";
export const obtenerTodosProductos=async()=>{
    const [array]=await pool.query('SELECT * FROM productos');
    return array;
}
export const crearNuevoProducto=async(tipo,nombre,precio)=>{
    const [resultado]=await pool.query('INSERT INTO productos(tipo,nombre,precio) VALUES(?,?,?)',[tipo,nombre,precio]);
    return resultado.insertId;
}
export const ActualizarProducto=async(id,tipo,nombre,precio)=>{
    await pool.query('UPDATE productos SET tipo=?, nombre=?, precio=? WHERE id=?',[tipo,nombre,precio,id]);
}
export const buscarProducto=async(id)=>{
    const [array]=await pool.query('SELECT * FROM productos WHERE id=?',[id]);
    return array[0];
}
export const EliminarProducto=async(id)=>{
    await pool.query('DELETE FROM productos WHERE id=?',[id]);
}