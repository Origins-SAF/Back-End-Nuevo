
import cronogramaModelo from '../models/cronograma.modelo.js';
import notificacionesModelo from '../models/notificaciones.modelo.js';
import usuarioModelo from '../models/usuario.modelo.js';

export const getCronograma = async (req, res) => {
    try {
        const cronograma = await cronogramaModelo.find({estado: true}).populate("detalles.puntos.puntoNombre", ["nombre"]) // consulta para todos los documentos
    
    // Respuesta del servidor
    res.json(cronograma);
    } catch (error) {
        console.log("Error al traer los cronogramas: ", error)
    }
  }

// Controlador que almacena un nuevo cronograma
export const postCronograma = async (req, res) => {
    // Desestructuramos la información recibida del cliente
  
   const datos = req.body;
   const usuarios = await usuarioModelo.find({}, 'uid')
   try {
       // Se alamacena el nuevo distribuidor en la base de datos
   const cronograma = new cronogramaModelo(datos);
   await cronograma.save() 
  
   const noti = {}
  
   noti.descripcion = `Nuevo Cronograma Guardado`
   noti.tipo = "Cronograma"
   noti.img = "ti-announcement"
   noti.color = "bg-success"
  
   const userID = []
      for (let i = 0; i < usuarios.length; i++) {
        //console.log()
        const nuevoUser = {
          leido: false,
          idUsuario: usuarios[i]._id
        }
        userID.push(nuevoUser);
      }
  
      noti.usuarios = userID
  
   const notificacionNueva = new notificacionesModelo(noti)
   await notificacionNueva.save()
  
   
   res.json({msg: 'El cronograma se guardo correctamente', notificacion: noti.descripcion});
   } catch (error) {
       console.log("Error al crear un cronograma: ", error)
   }
}

export const putCronograma = async (req, res) => {
    const { id } = req.params;

    // Desestructuramos la información recibida del cliente
  
   const datos = req.body;
   const usuarios = await usuarioModelo.find({}, 'uid')
   try {
       // Se alamacena el nuevo cronograma en la base de datos
   const cronograma = await cronogramaModelo.findByIdAndUpdate(
        id,
        datos,
        { new: true }
      );

      const noti = {}
  
   noti.descripcion = `Cronograma Actualizado`
   noti.tipo = "Cronograma"
   noti.img = "ti-announcement"
   noti.color = "bg-success"
  
   const userID = []
      for (let i = 0; i < usuarios.length; i++) {
        //console.log()
        const nuevoUser = {
          leido: false,
          idUsuario: usuarios[i]._id
        }
        userID.push(nuevoUser);
      }
  
      noti.usuarios = userID
  
   const notificacionNueva = new notificacionesModelo(noti)
   await notificacionNueva.save()
  
      res.json({
            notificacion: noti.descripcion,
          msg: "Cronograma actualizado correctamente",
          cronograma,
        });
   } catch (error) {
       console.log("Error al actualizar el cronograma: ", error)
   }
}