import parteModelo from "../models/parte.modelo.js";

export const getKilosVendidosDia = async (req, res) => {
  let diaPartes = req.query.dia;
  let mesPartes = req.query.mes;
  let semanaPartes = req.query.semana;
  let fecha = new Date(diaPartes);
  let fechaRecibida = new Date(diaPartes);
  fechaRecibida.setDate(fechaRecibida.getDate() + 1);
  const dia = fechaRecibida.getDate();
  const mes = fechaRecibida.getMonth() + 1; // Los meses en JavaScript van de 0 a 11, por lo que sumamos 1
  const año = fechaRecibida.getFullYear();

  const fechaRecibidaFormateada = `${año}-${mes < 10 ? "0" : ""}${mes}-${
    dia < 10 ? "0" : ""
  }${dia}`;
  let fecha2 = new Date(fechaRecibidaFormateada);

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

    // Función para obtener un identificador único de producto
    function obtenerIdProducto(producto) {
      return producto._id || producto.nombre;
    }

    // Objeto para almacenar los datos acumulados
    const resultado = [];

    // Función para convertir el valor de kilos vendidos a número
    function convertirKilosVendidos(valor) {
      // Si el valor es null o undefined, retornamos 0
      if (valor == null || isNaN(parseFloat(valor))) return 0;
      // Si el valor es un número, lo retornamos tal cual
      if (typeof valor === "number") return valor;
      // Si el valor es una cadena, intentamos convertirlo a número
      if (typeof valor === "string") {
        // Si el valor es una representación válida de número, lo convertimos
        const numero = parseFloat(valor);
        if (!isNaN(numero)) return numero;
      }
      // En cualquier otro caso, retornamos 0
      return 0;
    }

    const opciones = {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    let fechaFormateadaAR = fecha.toLocaleDateString("es-AR", opciones);

    // Agregar el campo "titulo" al objeto principal
    resultado.push({
      titulo: `Estadisticas del: ${fechaFormateadaAR}, semana ${semanaPartes}`,
      estadisticas: [],
    });

    // Recorrer los datos
    partes.forEach((registro) => {
      registro.distribuidor.forEach((distribuidor) => {
        const nombreDistribuidor = distribuidor.nombre.nombre;
        let distribuidorActual = resultado[0].estadisticas.find(
          (item) => item.distribuidor === nombreDistribuidor
        );
        if (!distribuidorActual) {
          distribuidorActual = {
            distribuidor: nombreDistribuidor,
            productos: {},
          };
          resultado[0].estadisticas.push(distribuidorActual);
        }
        distribuidor.stock.forEach((producto) => {
          const idProducto = obtenerIdProducto(producto.producto);
          if (!distribuidorActual.productos[idProducto]) {
            distribuidorActual.productos[idProducto] = {
              Nombre: producto.producto.nombre,
              "Kilos Vendidos": convertirKilosVendidos(producto.kilosVendidos),
            };
          } else {
            distribuidorActual.productos[idProducto]["Kilos Vendidos"] +=
              convertirKilosVendidos(producto.kilosVendidos);
          }
        });
      });
    });

    // Convertir el objeto de productos de cada distribuidor en un array
    resultado[0].estadisticas.forEach((item) => {
      item.productos = Object.values(item.productos);
    });

    /* console.log(resultado); */

    // Respuesta del servidor
    res.json(resultado);
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

    // Función para obtener un identificador único de producto
    function obtenerIdProducto(producto) {
      return producto._id || producto.nombre;
    }

    // Objeto para almacenar los datos acumulados
    const resultado = [];

    // Función para convertir el valor de kilos vendidos a número
    function convertirKilosVendidos(valor) {
      // Si el valor es null o undefined, retornamos 0
      if (valor == null || isNaN(parseFloat(valor))) return 0;
      // Si el valor es un número, lo retornamos tal cual
      if (typeof valor === "number") return valor;
      // Si el valor es una cadena, intentamos convertirlo a número
      if (typeof valor === "string") {
        // Si el valor es una representación válida de número, lo convertimos
        const numero = parseFloat(valor);
        if (!isNaN(numero)) return numero;
      }
      // En cualquier otro caso, retornamos 0
      return 0;
    }

    /* const opciones = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
let fechaFormateadaAR = fecha.toLocaleDateString('es-AR', opciones) */

    // Agregar el campo "titulo" al objeto principal
    resultado.push({
      titulo: `Estadisticas de la semana ${semanaPartes} del mes ${mesPartes} del ${añoPartes}`,
      estadisticas: [],
    });

    // Recorrer los datos
    partes.forEach((registro) => {
      registro.distribuidor.forEach((distribuidor) => {
        const nombreDistribuidor = distribuidor.nombre.nombre;
        let distribuidorActual = resultado[0].estadisticas.find(
          (item) => item.distribuidor === nombreDistribuidor
        );
        if (!distribuidorActual) {
          distribuidorActual = {
            distribuidor: nombreDistribuidor,
            productos: {},
          };
          resultado[0].estadisticas.push(distribuidorActual);
        }
        distribuidor.stock.forEach((producto) => {
          const idProducto = obtenerIdProducto(producto.producto);
          if (!distribuidorActual.productos[idProducto]) {
            distribuidorActual.productos[idProducto] = {
              Nombre: producto.producto.nombre,
              "Kilos Vendidos": convertirKilosVendidos(producto.kilosVendidos),
            };
          } else {
            distribuidorActual.productos[idProducto]["Kilos Vendidos"] +=
              convertirKilosVendidos(producto.kilosVendidos);
          }
        });
      });
    });

    // Convertir el objeto de productos de cada distribuidor en un array
    resultado[0].estadisticas.forEach((item) => {
      item.productos = Object.values(item.productos);
    });

    // Respuesta del servidor
    res.json(resultado);
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

    // Función para obtener un identificador único de producto
    function obtenerIdProducto(producto) {
      return producto._id || producto.nombre;
    }

    // Objeto para almacenar los datos acumulados
    const resultado = [];

    // Función para convertir el valor de kilos vendidos a número
    function convertirKilosVendidos(valor) {
      // Si el valor es null o undefined, retornamos 0
      if (valor == null || isNaN(parseFloat(valor))) return 0;
      // Si el valor es un número, lo retornamos tal cual
      if (typeof valor === "number") return valor;
      // Si el valor es una cadena, intentamos convertirlo a número
      if (typeof valor === "string") {
        // Si el valor es una representación válida de número, lo convertimos
        const numero = parseFloat(valor);
        if (!isNaN(numero)) return numero;
      }
      // En cualquier otro caso, retornamos 0
      return 0;
    }

    /* const opciones = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
let fechaFormateadaAR = fecha.toLocaleDateString('es-AR', opciones) */

    // Agregar el campo "titulo" al objeto principal
    resultado.push({
      titulo: `Estadisticas del mes ${mesPartes} de ${añoPartes}`,
      estadisticas: [],
    });

    // Recorrer los datos
    partes.forEach((registro) => {
      registro.distribuidor.forEach((distribuidor) => {
        const nombreDistribuidor = distribuidor.nombre.nombre;
        let distribuidorActual = resultado[0].estadisticas.find(
          (item) => item.distribuidor === nombreDistribuidor
        );
        if (!distribuidorActual) {
          distribuidorActual = {
            distribuidor: nombreDistribuidor,
            productos: {},
          };
          resultado[0].estadisticas.push(distribuidorActual);
        }
        distribuidor.stock.forEach((producto) => {
          const idProducto = obtenerIdProducto(producto.producto);
          if (!distribuidorActual.productos[idProducto]) {
            distribuidorActual.productos[idProducto] = {
              Nombre: producto.producto.nombre,
              "Kilos Vendidos": convertirKilosVendidos(producto.kilosVendidos),
            };
          } else {
            distribuidorActual.productos[idProducto]["Kilos Vendidos"] +=
              convertirKilosVendidos(producto.kilosVendidos);
          }
        });
      });
    });

    // Convertir el objeto de productos de cada distribuidor en un array
    resultado[0].estadisticas.forEach((item) => {
      item.productos = Object.values(item.productos);
    });

    // Respuesta del servidor
    res.json(resultado);
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

    // Función para obtener un identificador único de producto
    function obtenerIdProducto(producto) {
      return producto._id || producto.nombre;
    }

    // Objeto para almacenar los datos acumulados
    const resultado = [];

    // Función para convertir el valor de kilos vendidos a número
    function convertirKilosVendidos(valor) {
      // Si el valor es null o undefined, retornamos 0
      if (valor == null || isNaN(parseFloat(valor))) return 0;
      // Si el valor es un número, lo retornamos tal cual
      if (typeof valor === "number") return valor;
      // Si el valor es una cadena, intentamos convertirlo a número
      if (typeof valor === "string") {
        // Si el valor es una representación válida de número, lo convertimos
        const numero = parseFloat(valor);
        if (!isNaN(numero)) return numero;
      }
      // En cualquier otro caso, retornamos 0
      return 0;
    }

    /* const opciones = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
let fechaFormateadaAR = fecha.toLocaleDateString('es-AR', opciones) */

    // Agregar el campo "titulo" al objeto principal
    resultado.push({
      titulo: `Estadisticas generales del año ${añoPartes}`,
      estadisticas: [],
    });

    // Recorrer los datos
    partes.forEach((registro) => {
      registro.distribuidor.forEach((distribuidor) => {
        const nombreDistribuidor = distribuidor.nombre.nombre;
        let distribuidorActual = resultado[0].estadisticas.find(
          (item) => item.distribuidor === nombreDistribuidor
        );
        if (!distribuidorActual) {
          distribuidorActual = {
            distribuidor: nombreDistribuidor,
            productos: {},
          };
          resultado[0].estadisticas.push(distribuidorActual);
        }
        distribuidor.stock.forEach((producto) => {
          const idProducto = obtenerIdProducto(producto.producto);
          if (!distribuidorActual.productos[idProducto]) {
            distribuidorActual.productos[idProducto] = {
              Nombre: producto.producto.nombre,
              "Kilos Vendidos": convertirKilosVendidos(producto.kilosVendidos),
            };
          } else {
            distribuidorActual.productos[idProducto]["Kilos Vendidos"] +=
              convertirKilosVendidos(producto.kilosVendidos);
          }
        });
      });
    });

    // Convertir el objeto de productos de cada distribuidor en un array
    resultado[0].estadisticas.forEach((item) => {
      item.productos = Object.values(item.productos);
    });

    // Respuesta del servidor
    res.json(resultado);
  } catch (error) {
    console.log("Error al traer los partes: ", error);
  }
};
