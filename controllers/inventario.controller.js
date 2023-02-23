import inventarioModelo from '../models/inventario.modelo.js';


// Devuelve todos los inventarios activas de la colección
export const getInventarios = async (req, res) => {
  try {
      const inventarios = await inventarioModelo.find({estado: true}) // consulta para todos los documentos
  
  // Respuesta del servidor
  res.json(inventarios);
  } catch (error) {
      console.log("Error al traer los inventarios: ", error)
  }
}


// Controlador que almacena un nuevo inventario
export const postInventario = async (req, res) => {
  // Desestructuramos la información recibida del cliente

 const datos = req.body;

 try {
     // Se alamacena el nuevo inventario en la base de datos
 const inventario = new inventarioModelo(datos);
 await inventario.save() 

 res.json({msg: 'El inventario se guardo correctamente'});
 } catch (error) {
     console.log("Error al crear un inventario: ", error)
 }
}


