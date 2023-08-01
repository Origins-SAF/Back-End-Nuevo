import { model, Schema } from 'mongoose';

const ProductoConsorcioSchema = new Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio"],
    },
    precio: {
      type: Number,
      default: 0,
    },
    listaParteDia: {
      type: Boolean,
      default: true,
    },
    listaInventario: {
      type: Boolean,
      default: true,
    },
    publicado: {
      type: Boolean,
      default: false,
    },
    config: {
        colorEtiqueta: {
          type: String,
        },
        tituloEtiqueta:{
          type: String,
        },
    },
    /* puntosDeVenta: [
      {
        puntoNombre:{
          type: String,
        }
      }
    ], */
    categoria : {
      type: String,
      required: true
    },
    estado: {
        type: Boolean,
        default: true
      },
    img: { type: String, default:"img"},
  },
  { timestamps: true }
);

ProductoConsorcioSchema.methods.toJSON = function () {
  const { __v, estado, _id, ...data } = this.toObject();
  data.uid = _id;
  return data;
};

export default model("productoConsorcioModelo", ProductoConsorcioSchema);