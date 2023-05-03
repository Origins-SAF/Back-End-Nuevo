import notificacionesModelo from '../models/notificaciones.modelo.js';

// Devuelve todas las notificaciones no leidas de la colección
export const getNotificacionesActivas = async (req, res) => {
  try {
      const notificaciones = await notificacionesModelo.find({leido: false}) // consulta para todos los documentos
  
  // Respuesta del servidor
  res.json(notificaciones);
  } catch (error) {
      console.log("Error al traer las notificaciones: ", error)
  }
}

// Cambiar el estado leido de una notificacion (lógica)
export const cambiarEstadoNotificacion = async (req, res) => {
  const { id } = req.params;
  try {
    const notificacion = await notificacionesModelo.findByIdAndUpdate(
        id,
        { leido: true },
        { new: true }
      );
    
      // Respuesta del servidor
      res.json({
        msg: "Notificacion vista correctamente (lógica)",
        notificacion,
      });
  } catch (error) {
    console.log("Error al cambiar el estado de forma logica de la notificacion: ", error)
  }
};