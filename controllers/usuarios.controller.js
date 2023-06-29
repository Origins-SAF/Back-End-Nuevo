import usuarioModelo from '../models/usuario.modelo.js';


export const getUsuarios = async (req, res) => {

  try {
    const usuarios = await usuarioModelo.find().populate("rol", ["rol"]).populate("ubicacion.puntoFijo", ["nombre","barrio"]) 

    res.json(usuarios)
  } catch (error) {
  
    console.log("Error al mostrar los usuarios", error)
  }
};

export const actualizarUsuario = async (req, res) => {
  const { id } = req.params;
  //console.log(req.body)
  //console.log(req.body.nombre)
  let imgURl = await cloudinary.uploader.upload(req?.file?.path);

  if(req?.file?.path){
    imgURl = await cloudinary.uploader.upload(req?.file?.path)
  }else {
    imgURl = req.body?.img
  }
    
    //console.log(imgURl)

  const data = {
    ...req.body,
    img: imgURl?.url ? imgURl?.url : imgURl
  }
  try {

    await usuarioModelo.findByIdAndUpdate(id, data, { new: true });

    res.json({msg:"Se Actualizo el usuario"});
  } catch (err) {
    console.log("Error al actualizar el punto: ", err);
    res.status(500).json({
      msg: "Por favor, hable con el administrador",
    });
  }
}


