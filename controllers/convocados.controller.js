import convocadoModelo from '../models/convocados.modelo.js';

export const getConvocados = async (req, res) => {
    try {
        const convocados = await convocadoModelo.find({estado: true}) // consulta para todos los documentos
    
    // Respuesta del servidor
    res.json(convocados);
    } catch (error) {
        console.log("Error al traer los convocados: ", error)
    }
  }

// Controlador que almacena una nueva lista de convocados
export const postConvocados = async (req, res) => {
    // Desestructuramos la información recibida del cliente
  
   const datos = req.body;
   
   try {
       // Se alamacena la nueva lista en la base de datos
   const listConvocados = new convocadoModelo(datos);
   await listConvocados.save() 
  
   
  
   
   res.json({msg: 'La lista de convocados se guardo correctamente'});
   } catch (error) {
       console.log("Error al crear la lista de convocados: ", error)
   }
  }