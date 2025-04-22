import { Router } from "express";
import { obtenerProductos,crearProducto, ActualizarNuevoProducto, EliminarProductos } from "../controller/ProductController.js";

const router=Router();

router.get('/productos',obtenerProductos);
router.post('/productos',crearProducto);
router.put('/productos/:id',ActualizarNuevoProducto);
router.delete('/productos/:id',EliminarProductos);

export default router;
