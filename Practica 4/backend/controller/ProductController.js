import * as Producto from '../model/ProductModel.js';
export const obtenerProductos=async(req,res)=>{
    try{
        const productos=await Producto.obtenerTodosProductos();
        res.status(200).json(productos);
    }catch(error){
        res.status(500).json({message:'Error al obtener producto',error:error.message});
    }
}
export const crearProducto=async(req,res)=>{
    try{
        const {tipo}=req.body;
        const {nombre}=req.body;
        const {precio}=req.body;
        const newProducto=await Producto.crearNuevoProducto(tipo,nombre,precio);
        res.status(201).json({id:newProducto,message:'Producto creado'});
    }catch(error){
        res.status(500).json({message:'Error al cargar el producto',error:error.message});
    }
}
export const ActualizarNuevoProducto=async(req,res)=>{
    try{
        const {id}=req.params;
        const buscar=await Producto.buscarProducto(id);
        if(!buscar) return res.status(404).json({message:'Producto no encontrado'});
        await Producto.ActualizarProducto(id, req.body.tipo, req.body.nombre, req.body.precio);
        res.status(200).json({message:'Producto actualizado correctamente'});
    }catch(error){
        console.error(error);
        res.status(500).json({message:'Error al actualizar el producto',error:error.message});
    }  
}
export const EliminarProductos=async(req,res)=>{
    try {
        const {id}=req.params;
        const buscar=await Producto.buscarProducto(id);
        if(!buscar) return res.status(404).json({message:'Producto no encontrado'});
        await Producto.EliminarProducto(id);
        res.status(200).json({message:'Producto eliminado correctamente'});
    } catch (error) {
        console.error(error);
        res.status(500).json({message:'Error al actualizar el producto',error:error.message});
    }
}