import parteModelo from "../models/parte.modelo.js";

export const getKilosVendidosDia = async (req, res) => {
  let diaPartes = req.query.dia;
  let mesPartes = req.query.mes;
  let semanaPartes = req.query.semana;
  let fecha = new Date(diaPartes)
  let fechaRecibida = new Date(diaPartes)
  fechaRecibida.setDate(fechaRecibida.getDate() + 1);
  const dia = fechaRecibida.getDate();
  const mes = fechaRecibida.getMonth() + 1; // Los meses en JavaScript van de 0 a 11, por lo que sumamos 1
  const año = fechaRecibida.getFullYear();

  const fechaRecibidaFormateada = `${año}-${mes < 10 ? '0' : ''}${mes}-${dia < 10 ? '0' : ''}${dia}`;
  let fecha2 = new Date(fechaRecibidaFormateada)

  /* console.log(fecha)
  console.log(fechaFutura) */
  try {
    const partes = await parteModelo
      .find({
        fecha: {
          // Crear un rango de fechas para el año específico
          $gte: fecha, // 
          $lt: fecha2, // 
        },
        mesSemana: mesPartes,
        estado: true,
        nroSemana: semanaPartes,
      })
      .populate("usuario", ["nombre", "apellido", "img"]) // consulta para todos los documentos
      .populate("distribuidor.nombre", ["nombre"])
      .populate("ubicacion", ["nombre", "barrio", "tipo"])
      .populate("distribuidor.stock.producto", [
        "nombre",
        "img",
        "listaInventario",
        "totalEdit",
        "listaParteDia",
        "peso",
      ])
      .populate("distribuidor.prodmasvendido", ["nombre"]);

// Objeto para almacenar los kilos vendidos de cada producto
// Objeto para almacenar los kilos vendidos de cada producto
const productosVendidos = {};
const arrayGrupo = []
// Iterar sobre cada objeto de venta en el array
partes.forEach((venta) => {
    // Iterar sobre cada distribuidor en la venta
    venta.distribuidor.forEach((distribuidor) => {
        // Iterar sobre cada producto en el stock del distribuidor
        distribuidor.stock.forEach((producto) => {
            const nombreProducto = producto.producto.nombre;
            const kilosVendidos = producto.kilosVendidos;

            // Si el producto ya existe en el objeto productosVendidos,
            // acumular los kilos vendidos
            if (productosVendidos[nombreProducto]) {
                productosVendidos[nombreProducto] += kilosVendidos;
            } else {
                // Si es la primera vez que se encuentra este producto,
                // inicializar los kilos vendidos en el objeto productosVendidos
                productosVendidos[nombreProducto] = kilosVendidos;
            }
        });
       
      
    });
    console.log("==========")
    console.log(venta.ubicacion.nombre)
    console.log(productosVendidos)

    let datos = {
      punto: venta?.ubicacion?.nombre || "Sin Nombre",
      productos: [productosVendidos]
    }
    arrayGrupo.push(datos)
});

// Objeto para almacenar los kilos vendidos de cada producto
const kilosVendidosTotales = {};

// Iterar sobre cada punto
arrayGrupo.forEach((punto) => {
    // Iterar sobre los productos de cada punto
    punto.productos.forEach((producto) => {
        // Iterar sobre cada producto y sumar los kilos vendidos al total
        for (const nombreProducto in producto) {
            const kilosVendidos = producto[nombreProducto];
            if (kilosVendidos !== null) {
                if (kilosVendidosTotales[nombreProducto]) {
                    kilosVendidosTotales[nombreProducto] += kilosVendidos;
                } else {
                    kilosVendidosTotales[nombreProducto] = kilosVendidos;
                }
            }
        }
    });
});

// Convertir el objeto kilosVendidosTotales a un array de objetos
const arrayKilosVendidosTotales = Object.entries(kilosVendidosTotales).map(([nombreProducto, kilosVendidos]) => ({
    nombreProducto,
    kilosVendidos
}));

    // Respuesta del servidor
    res.json(arrayGrupo);
  } catch (error) {
    console.log("Error al traer los partes: ", error);
  }
};

export const getKilosVendidosSemana = async (req, res) => {
  let mesPartes = req.query.mes;
  let semanaPartes = req.query.semana;
  let añoPartes = parseInt(req.query.ano);

  try {
    const partes = await parteModelo
      .find({
        fecha: {
          // Crear un rango de fechas para el año específico
          $gte: new Date(añoPartes, 0, 1), // Primer día del año
          $lt: new Date(añoPartes + 1, 0, 1), // Primer día del siguiente año
        },
        mesSemana: mesPartes,
        estado: true,
        nroSemana: semanaPartes,
      })
      .populate("usuario", ["nombre", "apellido", "img"]) // consulta para todos los documentos
      .populate("distribuidor.nombre", ["nombre"])
      .populate("ubicacion", ["nombre", "barrio", "tipo"])
      .populate("distribuidor.stock.producto", [
        "nombre",
        "img",
        "listaInventario",
        "totalEdit",
        "listaParteDia",
        "peso",
      ])
      .populate("distribuidor.prodmasvendido", ["nombre"]);

    const productosVendidos = {};

    partes.forEach((venta) => {
      venta.distribuidor.forEach((distribuidor) => {
        distribuidor.stock.forEach((producto) => {
          const nombreProducto = producto.producto.nombre;
          const kilosVendidos = producto.kilosVendidos;

          if (productosVendidos[nombreProducto]) {
            productosVendidos[nombreProducto] += kilosVendidos;
          } else {
            productosVendidos[nombreProducto] = kilosVendidos;
          }
        });
      });
    });

    const arrayProductosVendidos = Object.keys(productosVendidos).map(
      (nombreProducto) => {
        return {
          nombreProducto,
          kilosVendidos: productosVendidos[nombreProducto],
        };
      }
    );

    /* console.log(arrayProductosVendidos); */

    // Respuesta del servidor
    res.json(arrayProductosVendidos);
  } catch (error) {
    console.log("Error al traer los partes: ", error);
  }
};

export const getKilosVendidosMes = async (req, res) => {
  let mesPartes = req.query.mes;
  let añoPartes = parseInt(req.query.ano);

  try {
    const partes = await parteModelo
      .find({
        fecha: {
          // Crear un rango de fechas para el año específico
          $gte: new Date(añoPartes, 0, 1), // Primer día del año
          $lt: new Date(añoPartes + 1, 0, 1), // Primer día del siguiente año
        },
        mesSemana: mesPartes,
        estado: true,
      })
      .populate("usuario", ["nombre", "apellido", "img"]) // consulta para todos los documentos
      .populate("distribuidor.nombre", ["nombre"])
      .populate("ubicacion", ["nombre", "barrio", "tipo"])
      .populate("distribuidor.stock.producto", [
        "nombre",
        "img",
        "listaInventario",
        "totalEdit",
        "listaParteDia",
        "peso",
      ])
      .populate("distribuidor.prodmasvendido", ["nombre"]);

    const productosVendidos = {};

    partes.forEach((venta) => {
      venta.distribuidor.forEach((distribuidor) => {
        distribuidor.stock.forEach((producto) => {
          const nombreProducto = producto.producto.nombre;
          const kilosVendidos = producto.kilosVendidos;

          if (productosVendidos[nombreProducto]) {
            productosVendidos[nombreProducto] += kilosVendidos;
          } else {
            productosVendidos[nombreProducto] = kilosVendidos;
          }
        });
      });
    });

    const arrayProductosVendidos = Object.keys(productosVendidos).map(
      (nombreProducto) => {
        return {
          nombreProducto,
          kilosVendidos: productosVendidos[nombreProducto],
        };
      }
    );

    /* console.log(arrayProductosVendidos); */

    // Respuesta del servidor
    res.json(arrayProductosVendidos);
  } catch (error) {
    console.log("Error al traer los partes: ", error);
  }
};

export const getKilosVendidosAno = async (req, res) => {
  
  let añoPartes = parseInt(req.query.ano);

  try {
    const partes = await parteModelo
      .find({
        fecha: {
          // Crear un rango de fechas para el año específico
          $gte: new Date(añoPartes, 0, 1), // Primer día del año
          $lt: new Date(añoPartes + 1, 0, 1), // Primer día del siguiente año
        },
        estado: true,
      })
      .populate("usuario", ["nombre", "apellido", "img"]) // consulta para todos los documentos
      .populate("distribuidor.nombre", ["nombre"])
      .populate("ubicacion", ["nombre", "barrio", "tipo"])
      .populate("distribuidor.stock.producto", [
        "nombre",
        "img",
        "listaInventario",
        "totalEdit",
        "listaParteDia",
        "peso",
      ])
      .populate("distribuidor.prodmasvendido", ["nombre"]);

    const productosVendidos = {};

    partes.forEach((venta) => {
      venta.distribuidor.forEach((distribuidor) => {
        distribuidor.stock.forEach((producto) => {
          const nombreProducto = producto.producto.nombre;
          const kilosVendidos = producto.kilosVendidos;

          if (productosVendidos[nombreProducto]) {
            productosVendidos[nombreProducto] += kilosVendidos;
          } else {
            productosVendidos[nombreProducto] = kilosVendidos;
          }
        });
      });
    });

    const arrayProductosVendidos = Object.keys(productosVendidos).map(
      (nombreProducto) => {
        return {
          nombreProducto,
          kilosVendidos: productosVendidos[nombreProducto],
        };
      }
    );

    /* console.log(arrayProductosVendidos); */

    // Respuesta del servidor
    res.json(arrayProductosVendidos);
  } catch (error) {
    console.log("Error al traer los partes: ", error);
  }
};