import noticiaModelo from '../models/noticia.modelo.js';
import notificacionesModelo from '../models/notificaciones.modelo.js';
import usuarioModelo from '../models/usuario.modelo.js'
// Devuelve todos los noticias activas de la colección
export const getNoticias = async (req, res) => {

  const limit = parseInt(req.query.limit);
  const skip = parseInt(req.query.skip);


  try {
      const noticias = await noticiaModelo.find()
      const todasLasNoticias = noticias.reverse() // consulta para todos los documentos
      const noticiasFiltradas = todasLasNoticias.slice(skip, skip + limit);
      const primeraNoticia = noticiasFiltradas[0]
      const otrasNoticias = noticiasFiltradas.slice(1)
  // Respuesta del servidor
  res.json({primeraNoticia,otrasNoticias});
  } catch (error) {
      console.log("Error al traer las noticias: ", error)
  }
}

// Devuelve una  noticia  de la colección
export const getNoticiarUnica = async (req, res) => {
  const {id } = req.params;
  try {
      const noticia = await noticiaModelo.findById(id) // consulta para todos los documentos
  
  // Respuesta del servidor
  res.json(noticia);
  } catch (error) {
      console.log("Error al traer la noticia: ", error)
  }
}


// Controlador que almacena una nueva noticia
export const postNoticia = async (req, res) => {
  // Desestructuramos la información recibida del cliente

 const datos = req.body;
const usuarios = await usuarioModelo.find({}, 'uid')
 try {

 // Se alamacena la nueva noticia en la base de datos
 const noticia = new noticiaModelo(datos);
 await noticia.save() 
  //console.log(usuarios)
 const noti = {}

 noti.descripcion = `Nueva Noticia Subida (${noticia.titulo})`
 noti.tipo = "Noticia"
 noti.img = "ti-clipboard"


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

 
 res.json({msg: 'La Noticia se guardo correctamente', notificacion: noti.descripcion});
 } catch (error) {
     console.log("Error al crear una noticia: ", error)
 }
}

// Controlador que almacena una nueva noticia
export const updateNoticia = async (req, res) => {

    const { id } = req.params;

  // Desestructuramos la información recibida del cliente

 const datos = req.body;

 try {
     // Se alamacena la nueva noticia en la base de datos
 const noticia = await noticiaModelo.findByIdAndUpdate(
      id,
      {
        titulo: datos.titulo,
        descripcion: datos.descripcion,  
        img: datos.img,
        publicado: datos.publicado
      },
      { new: true }
    );

    res.json({
        msg: "Noticia actualizada correctamente",
        noticia,
      });
 } catch (error) {
     console.log("Error al actualizar la noticia: ", error)
 }
}

// Cambiar el estado publicado de una noticia (Eliminación lógica)
export const desactivarNoticia = async (req, res) => {
    const { id } = req.params;

    try {
      const noticia = await noticiaModelo.findByIdAndUpdate(
          id,
          { publicado: false },
          { new: true }
        );
      
        // Respuesta del servidor
        res.json({
          msg: "Noticia desactivada correctamente (lógica)",
          noticia,
        });
    } catch (error) {
      console.log("Error al desactivar de forma logica la noticia: ", error)
    }
  };

// Cambiar el estado publicado de una noticia (lógica)
export const publicarNoticia = async (req, res) => {
    const { id } = req.params;
    try {
      const noticia = await noticiaModelo.findByIdAndUpdate(
          id,
          { publicado: true },
          { new: true }
        );
      
        // Respuesta del servidor
        res.json({
          msg: "Noticia Publicada correctamente (lógica)",
          noticia,
        });
    } catch (error) {
      console.log("Error al publicar de forma logica la noticia: ", error)
    }
  };

// Controlador para eliminar una noticia de la BD físicamente
export const eliminarNoticia = async (req, res) => {
    const { id } = req.params;
  
    try {
      // Ejecución normal del programa
      await noticiaModelo.findByIdAndDelete(id);
  
      res.json({
        msg: "Noticia Eliminada (físicamente) correctamente",
      });
    } catch (error) {
      // Si ocurre un error
      console.log("Error al eliminar la noticia: ", error);
    }
  };
