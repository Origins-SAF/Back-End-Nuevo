import parteModelo from '../models/parte.modelo.js' ;


// Devuelve todos los partes activas de la colección
export const getPartes = async (req, res) => {
    try {
        const partes = await parteModelo.find({estado: true}) // consulta para todos los documentos
    
    // Respuesta del servidor
    res.json(partes);
    } catch (error) {
        console.log("Error al traer los partes: ", error)
    }
  }


// Controlador que almacena un nuevo parte
// CREAR PARTE
export const postParte = async (req, res) => {
    // Desestructuramos la información recibida del cliente
  
   const datos = req.body;
  
   try {
       // Se alamacena el nuevo inventario en la base de datos
   const parte = new parteModelo(datos);
   await parte.save() 
  
   res.json({msg: 'El parte se guardó correctamente'});
   } catch (error) {
       console.log("Error al crear el parte: ", error)
   }
  }

  // Controlador que actualiza un parte
// ACTUALIZAR PARTE
export const putParte = async (req, res = response) => {
    const { id } = req.params;
    const { usuario, ...data } = req.body;
  
    try {
        data.fecha;
        data.distribuidor;
        //console.log(data.fecha)
        data.usuario = req.usuario._id;
        //console.log(id)
      await parteModelo.findByIdAndUpdate(id, data, { new: true });
        
      res.json( {msg: 'El parte se actualizó correctamente'});
    } catch (error) {
        console.log("Error al actualizar el parte: ", error);
    }
  }
