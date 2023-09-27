import semanaModelo from "../models/semanas.modelo.js";

export const getSemanas = async (req, res) => {
  try {
    const semanas = await semanaModelo.find();

    res.json(semanas);
  } catch (error) {
    console.log("Error al mostrar las semanas", error);
  }
};

export const guardarSemana = async (req, res) => {
    try {
      const datos = req.body;
      // Se alamacena el nuevo rol en la base de datos
      const semana = new semanaModelo(datos);
      await semana.save();
      res.json({msg: 'La semana se guardo correctamente'});
    } catch (error) {
      console.log("Error al crear una semana: ", error)
    }
  };

 export const cambiarEstadoSemana = async (req, res) => {
    const { idSemana } = req.params;
    const datos = req.body.activo;

    /* console.log(req.body) */
    try {
      const semana = await semanaModelo.findByIdAndUpdate(
            idSemana,
          { activo: datos },
          { new: true }
        );
      
        // Respuesta del servidor
        res.json({
          msg: "Se cambio el estado de la semana",
          semana,
        });
    } catch (error) {
      console.log("Error al cambiar el estado de la semana: ", error)
    }
  };  