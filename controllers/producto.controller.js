import productoModelo from '../models/producto.modelo.js';


// Devuelve todos los productos activas de la colección
export const getProducto = async (req, res) => {
  try {
      const productos = await productoModelo.find({estado: true}) // consulta para todos los documentos
  
  // Respuesta del servidor
  res.json(productos);
  } catch (error) {
      console.log("Error al traer los productos: ", error)
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