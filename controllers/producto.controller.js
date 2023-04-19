import productoModelo from '../models/producto.modelo.js';
import mongoose from 'mongoose';

// Devuelve todos los productos activas de la colección
export const getProducto = async (req, res) => {
  const limit = parseInt(req.query.limit);
  const skip = parseInt(req.query.skip);
 /*  console.log(limit)
  console.log(skip) */

  try {
      const productos = await productoModelo.find() // consulta para todos los documentos
      //const tamano = (await productoModelo.find()).length
      const totalPage = productos.length
      //console.log(productos)
      const productosFiltrados = productos.slice(skip, skip + limit);
  // Respuesta del servidor
  res.json({totalPage,productosFiltrados});
  } catch (error) {
      console.log("Error al traer los productos: ", error)
  }
}

export const getProductoDistribuidores = async (req, res) => {

    const { id, numPage } = req.params;
    //console.log(numPage)

  try {
      const productos = await productoModelo.find({distribuidor: mongoose.Types.ObjectId(id)}); // consulta para todos los documentos
    
      //console.log(productos)
  // Respuesta del servidor
  const productoUnico = productos[numPage]
  /* 
  if(productoUnico){
   
  }else{
    res.json({ msg: "No hay más Productos" });
  } */
  res.json(productoUnico);
  } catch (error) {
      console.log("Error al traer los productos por distribuidor: ", error)
  }
}

export const getProductoDistribuidoresTodos = async (req, res) => {

    const { id } = req.params;
    //console.log(numPage)

  try {
      const productos = await productoModelo.find({distribuidor: mongoose.Types.ObjectId(id)}); // consulta para todos los documentos
    
      //console.log(productos)
  // Respuesta del servidor

  res.json({cantidadProductos: productos.length});
  } catch (error) {
      console.log("Error al traer los productos por distribuidor: ", error)
  }
}

// Controlador que almacena un nuevo inventario
export const postProducto = async (req, res) => {
  // Desestructuramos la información recibida del cliente

 const datos = req.body;

 try {
     // Se alamacena el nuevo inventario en la base de datos
 const producto = new productoModelo(datos);
 await producto.save() 

 res.json({msg: 'El producto se guardo correctamente'});
 } catch (error) {
     console.log("Error al crear un producto: ", error)
 }
}

export const reactivarProductoLog = async (req, res) => {
  const { id } = req.params;

  try {
    const productoReactivado = await productoModelo.findByIdAndUpdate(
      id,
      { estado: true },
      { new: true }
    );

    res.json({
      msg: "Producto Reactivado correctamente (lógica)",
      productoReactivado,
    });
  } catch (err) {
    console.log("Error al reactivar el producto: ", err);
    res.status(500).json({
      msg: "Por favor, hable con el administrador",
    });
  }
};