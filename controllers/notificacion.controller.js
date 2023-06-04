import notificacionesModelo from '../models/notificaciones.modelo.js';
import mongoose from 'mongoose';
// Devuelve todas las notificaciones no leidas de la colección
export const getNotificacionesActivas = async (req, res) => {
  const idUser = req.usuario._id

  const limit = parseInt(req.query.limit);
  const skip = parseInt(req.query.skip);
  console.log(limit)
  try {
      const notis = await (await notificacionesModelo.find()).reverse() // consulta para todos los documentos
      const notificaciones =  notis.slice(skip, skip + limit);
      console.log(notificaciones)
      const long = notificaciones?.length
      const userNotificaciones = []
      for (let i = 0; i < long; i++) {
        //console.log(notificaciones[i]?.usuarios)
        let par = notificaciones[i]?.usuarios
        let notis = notificaciones[i]
        //userID.push(par);
        //console.log(i)
        for(let x = 0; x < par?.length; x++){
            //console.log(par[x]?.idUsuario)
            let idArray = par[x]?.idUsuario.toString()
            let idToken = idUser.toString()
            if(idToken === idArray){

              if(par[x]?.leido == false){
                //console.log("No Leido")
                userNotificaciones.push({
                  descripcion: notis.descripcion,
                  tipo: notis.tipo,
                  img: notis.img,
                  color: notis.color,
                  uid: notis._id
                })
              }
            }
        }
      }


  
  // Respuesta del servidor
  console.log(userNotificaciones)
    res.json(userNotificaciones);
  } catch (error) {
      console.log("Error al traer las notificaciones: ", error)
  }
}

// Cambiar el estado leido de una notificacion (lógica)
export const cambiarEstadoNotificacion = async (req, res) => {
  const { id } = req.params;
  const idUser = req.usuario._id
  try {
    const notificacion = await notificacionesModelo.findById(id)
    if(!notificacion) return res.status(404).json({msg:'La Notificacion No Existe'})

    const usuario = await notificacion.usuarios.find(user => user.idUsuario.toString() === idUser.toString())
    //console.log(notificacion.usuarios)
    if(!usuario) return res.status(404).json({msg: 'El usuario no existe'})
      // Respuesta del servidor

      function removeIndex(list){
        for (let i=0; i <= list.length; i++){
          if (list[i].idUsuario.toString() === idUser.toString()){return i}
        }
      }

      const remove = removeIndex(notificacion.usuarios)

      //console.log(notificacion.usuarios[remove].leido)
      notificacion.usuarios[remove].leido = true

      await notificacion.save()
      res.json({
        msg: "Notificacion vista correctamente (lógica)",
        notificacion,
      });
  } catch (error) {
    console.log("Error al cambiar el estado de forma logica de la notificacion: ", error)
  }
};