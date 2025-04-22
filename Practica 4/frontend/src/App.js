import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useCallback, useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Swal from 'sweetalert2';
import { RiEdit2Line } from "react-icons/ri";
import { RiDeleteBin5Line } from "react-icons/ri";


function App() {
  const [productos,setProductos]=useState([]);
  const[formularioAgregar,SetAgregarProducto]=useState({
    tipo:'',
    nombre:'',
    precio:''
  });

  const[formularioEditar,SetEditarProducto]=useState({
    tipo:'',
    nombre:'',
    precio:''
  });
  const[productoId,SetProductoId]=useState(null);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [mostrar, setMostrar] = useState(false);
  const CerrarModal = () => setMostrar(false);
  const AbrirModal = () => setMostrar(true);

  const fetchProductos=useCallback(async()=>{
    try{
      const respuesta=await fetch('http://localhost:3001/api/productos');
      const data=await respuesta.json();
      setProductos(data);
    }catch(error){
      alert('ERROR'+error);
    }
  },[]);
  useEffect(()=>{
    fetchProductos();
  },[fetchProductos]);

  const Agregar=async(e)=>{
    e.preventDefault();
    if(!formularioAgregar.nombre.trim()){
      alert('Nombre requerido');
      return;
    }
    try{
      const respuesta=await fetch(`http://localhost:3001/api/productos`,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          ...formularioAgregar
        })
      });
      if(!respuesta.ok){
        let errorMensaje='Error al cargar';
        try{
          const error=await respuesta.json();
          errorMensaje=error.message || errorMensaje
        }catch(error){
          console.error(error);
        }
        throw new Error(errorMensaje);
      }
      handleClose();
      Swal.fire({
        title: "Se agrego correctamente el producto",
        icon: "success",
        draggable: true,
        timer:2000
      });
      fetchProductos();
    }catch(error){
      console.error(error);
      Swal.fire({
        title: "No se pudo agregar el nuevo producto",
        icon: "error",
        draggable: true,
        timer:2000
      });
    }
  }
  const cambiosFormularioAgregar=async(e)=>{
    SetAgregarProducto({
      ...formularioAgregar,
      [e.target.name]:e.target.value
    })
  }
  const EditarProductos=(producto)=>{
    SetEditarProducto({
      tipo:producto.tipo,
      nombre:producto.nombre,
      precio:producto.precio
    });
    SetProductoId(producto.id);
    AbrirModal();
  }
  const cambiosFormularioEditar=(e)=>{
    SetEditarProducto({
      ...formularioEditar,
      [e.target.name]:e.target.value
    });
  }
  const EditarProducto=async (e)=>{
    e.preventDefault();
    if(!formularioEditar.nombre.trim()){
      alert('Nombre requerido');
      return;
    }
    try{
      const respuesta=await fetch(`http://localhost:3001/api/productos/${productoId}`,{
        method:'PUT',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          ...formularioEditar
        })
      });
      if(!respuesta.ok){
        let errorMensaje='Error al cargar';
        try{
          const error=await respuesta.json();
          errorMensaje=error.message || errorMensaje
        }catch(error){
          console.error(error);
        }
        throw new Error(errorMensaje);
      }
      CerrarModal();
      Swal.fire({
        title: "Se edito correctamente el producto",
        icon: "success",
        draggable: true,
        timer:2000
      });
      fetchProductos();
    }catch(error){
      console.error(error);
      Swal.fire({
        title: "No se pudo editar el nuevo producto",
        icon: "error",
        draggable: true,
        timer:2000
      });
    }
  }
  const EliminarProducto=async(id)=>{
    Swal.fire({
      title: "Estas seguro de que deseas eliminar este registro?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar!"
    }).then(async(result) => {
      if (result.isConfirmed) {
        try{
          await fetch(`http://localhost:3001/api/productos/${id}`,{
            method:`DELETE`
          });
          Swal.fire({
            title: "Producto eliminado correctamente!",
            icon: "success",
            timer:'2000'
          });
          fetchProductos();
        }catch(error){
          Swal.fire({
            title: "No se pudo eliminar el producto!",
            icon: "error",
            timer:'2000'
          });
        }
        
      }
    });
  }
  return (
    <div className="contenedor">
      <h1 className='titulo'>FARMACIA</h1>
      <Button variant="dark" onClick={handleShow} className='boton1'>Crear</Button>
      <Table striped bordered hover>
      <thead>
        <tr>
          <th>id</th>
          <th>Tipo</th>
          <th>Nombre</th>
          <th>Precio</th>
        </tr>
      </thead>
      <tbody>
        {productos.map(producto=>(
          <tr key={producto.id}>
            <td>{producto.id}</td>
            <td>{producto.tipo}</td>
            <td>{producto.nombre}</td>
            <td>{producto.precio}</td>
            <td>
            <div className="btn-group" role="group" aria-label="Basic example">
              <button type="button" className="btn btn-secondary" id='boton2' onClick={()=>{EditarProductos(producto)}}><RiEdit2Line /></button>
              <button type="button" className="btn btn-secondary" id='boton3' onClick={()=>{EliminarProducto(producto.id)}}><RiDeleteBin5Line /></button>
            </div>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
    {/*Modal para ingresar */}
    <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Crear nuevo registro</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Tipo de medicamento</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el tipo de medicamento"
                name='tipo'
                onChange={cambiosFormularioAgregar}
                value={formularioAgregar.tipo}
              />
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el nombre"
                name='nombre'
                onChange={cambiosFormularioAgregar}
                value={formularioAgregar.nombre}
              />
              <Form.Label>Precio</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el precio"
                name='precio'
                onChange={cambiosFormularioAgregar}
                value={formularioAgregar.precio}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={Agregar}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    {/*Modla para editar*/}
    <Modal show={mostrar} onHide={CerrarModal}>
        <Modal.Header closeButton>
          <Modal.Title>Editar registro</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Tipo de medicamento</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el tipo del medicamento"
                name='tipo'
                onChange={cambiosFormularioEditar}
                value={formularioEditar.tipo}
              />
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el nombre"
                name='nombre'
                onChange={cambiosFormularioEditar}
                value={formularioEditar.nombre}
              />
              <Form.Label>Precio</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el precio"
                name='precio'
                onChange={cambiosFormularioEditar}
                value={formularioEditar.precio}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={CerrarModal}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={EditarProducto}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default App;
