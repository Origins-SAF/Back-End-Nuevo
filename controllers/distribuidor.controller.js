import distribuidorModelo from '../models/distribuidor.modelo.js';
import notificacionesModelo from '../models/notificaciones.modelo.js';
import usuarioModelo from '../models/usuario.modelo.js';
// Devuelve todos los distribuidor activas de la colección
export const getDistribuidores = async (req, res) => {
  try {
      const distribuidores = await distribuidorModelo.find({estado: true}) // consulta para todos los documentos
  
  // Respuesta del servidor
  res.json(distribuidores);
  } catch (error) {
      console.log("Error al traer los distribuidores: ", error)
  }
}

// Devuelve todos los distribuidor activas de la colección
export const getDistribuidorUnico = async (req, res) => {
  const {id } = req.params;
  try {
      const distribuidor = await distribuidorModelo.findById(id) // consulta para todos los documentos
  
  // Respuesta del servidor
  res.json(distribuidor);
  } catch (error) {
      console.log("Error al traer el distribuidor: ", error)
  }
}


// Controlador que almacena un nuevo distribuidor
export const postDistribuidores = async (req, res) => {
  // Desestructuramos la información recibida del cliente

 const datos = req.body;
 const usuarios = await usuarioModelo.find({}, 'uid')
 try {
     // Se alamacena el nuevo distribuidor en la base de datos
 const distribuidor = new distribuidorModelo(datos);
 await distribuidor.save() 

 const noti = {}

 noti.descripcion = `Nuevo Distribuidor (${distribuidor.nombre})`
 noti.tipo = "Distribuidor"
 noti.img = "ti-id-badge"
 noti.color = "bg-info"

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

 
 res.json({msg: 'El distribudor se guardo correctamente', notificacion: noti.descripcion});
 } catch (error) {
     console.log("Error al crear un distribuidor: ", error)
 }
}

// Controlador que almacena un nuevo distribuidor
export const updateDistribuidores = async (req, res) => {

    const { id } = req.params;

  // Desestructuramos la información recibida del cliente

 const datos = req.body;

 try {
     // Se alamacena el nuevo distribuidor en la base de datos
 const distribudor = await distribuidorModelo.findByIdAndUpdate(
      id,
      {
        nombre: datos.nombre,
      },
      { new: true }
    );

    res.json({
        msg: "Distribudor actualizado correctamente",
        distribudor,
      });
 } catch (error) {
     console.log("Error al actualizar el distribuidor: ", error)
 }
}

// Cambiar el estado activo de un distribuidor (Eliminación lógica)
export const deleteLogDistribuidor = async (req, res) => {
    const { id } = req.params;
    try {
      const distribudor = await distribuidorModelo.findByIdAndUpdate(
          id,
          { estado: false },
          { new: true }
        );
      
        // Respuesta del servidor
        res.json({
          msg: "Distribuidor eliminado correctamente (lógica)",
          distribudor,
        });
    } catch (error) {
      console.log("Error al eliminar de forma logica un distribuidor: ", error)
    }
  };

// Cambiar el estado activo de un distribuidor (Eliminación lógica)
export const reactivarLogDistribuidor = async (req, res) => {
    const { id } = req.params;
    try {
      const distribudor = await distribuidorModelo.findByIdAndUpdate(
          id,
          { estado: true },
          { new: true }
        );
      
        // Respuesta del servidor
        res.json({
          msg: "Distribuidor reactivado correctamente (lógica)",
          distribudor,
        });
    } catch (error) {
      console.log("Error al reactivar de forma logica un distribuidor: ", error)
    }
  };

// Controlador para eliminar un distribuidor de la BD físicamente
export const deleteDistribuidor = async (req, res) => {
    const { id } = req.params;
  
    try {
      // Ejecución normal del programa
      await distribuidorModelo.findByIdAndDelete(id);
  
      res.json({
        msg: "Distribuidor eliminado (físicamente) correctamente",
      });
    } catch (error) {
      // Si ocurre un error
      console.log("Error al eliminar el distribuidor: ", error);
    }
  };
