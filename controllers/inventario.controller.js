import inventarioModelo from '../models/inventario.modelo.js';


// Devuelve todos los inventarios activas de la colección
export const getInventarios = async (req, res) => {
  try {

      const inventarios = await inventarioModelo.find({estado: true}).populate('usuario',["nombre","apellido","img"]) // consulta para todos los documentos

  // Respuesta del servidor
  res.json(inventarios);
  } catch (error) {
      console.log("Error al traer los inventarios: ", error)
  }
}

export const obtenerInventarios = async (req, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };
  
    try {
      const [total, puntos, tabla] = await Promise.all([
        inventarioModelo.countDocuments(query),
        inventarioModelo.find(query)
          .populate("usuario", ["nombre","apellido","img"])
          .skip(Number(desde))
            .limit(Number(limite)),
          inventarioModelo.aggregate([
          { $match: query },
          {
            $lookup: {
              from: "usuarios",
              localField: "usuario",
              foreignField: "_id",
              as: "usuario",
            },
          },
          { $unwind: "$usuario" },
          {
            $project: {
              _id: 0,
              id: "$_id",
              nombre: 1,
            departamento: 1,
            barrio: 1,
            descripcion: 1,
            usuario: "$usuario.nombre",
            updatedAt: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$updatedAt",
              },
            },
            },
          },
        ]),
      ]);
  
      res.json({
        total,
      tabla,
      puntos,
      });
    } catch (err) {
      console.log("Error al mostrar los puntos: ", err);
      res.status(500).json({
        msg: "Por favor, hable con el administrador",
      });
    }
  };


// Controlador que almacena un nuevo inventario
export const postInventario = async (req, res) => {
  // Desestructuramos la información recibida del cliente

 const datos = req.body;

 try {
     // Se alamacena el nuevo inventario en la base de datos
     datos.usuario = req.usuario.id
     //console.log(datos)

 const inventario = new inventarioModelo(datos);
 await inventario.save() 

 res.json({msg: 'El inventario se guardo correctamente'});
 } catch (error) {
     console.log("Error al crear un inventario: ", error)
 }
}


