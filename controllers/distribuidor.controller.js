import distribuidorModelo from '../models/distribuidor.modelo.js';


// Devuelve todos los distribuidor activas de la colección
export const getDistribuidores = async (req, res) => {
  try {
      const distribuidores = await distribuidorModelo.find() // consulta para todos los documentos
  
  // Respuesta del servidor
  res.json(distribuidores);
  } catch (error) {
      console.log("Error al traer los distribuidores: ", error)
  }
}


// Controlador que almacena un nuevo distribuidor
export const postDistribuidores = async (req, res) => {
  // Desestructuramos la información recibida del cliente

 const datos = req.body;

 try {
     // Se alamacena el nuevo distribuidor en la base de datos
 const distribuidor = new distribuidorModelo(datos);
 await distribuidor.save() 

 res.json({msg: 'El distribudor se guardo correctamente'});
 } catch (error) {
     console.log("Error al crear un distribuidor: ", error)
 }
}


