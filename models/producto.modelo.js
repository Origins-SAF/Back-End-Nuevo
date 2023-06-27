import { model, Schema } from 'mongoose';

const ProductoSchema = new Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio"],
   
    },
    estado: {
      type: Boolean,
      default: true
    },
    unidad: {
      type: String,
      default: "UN",
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
    descripcion: { type: String },

    distribuidor: {
      type: Schema.Types.ObjectId,
      ref: "distribuidorModelo",
      required: true,
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
    puntosDeVenta: [
      {
        
        puntoNombre:{
          type: String,
        }
      }
    ],
    categoria : {
      type: String,
      required: true
    },

    img: { type: String, default:"img"},
  },
  { timestamps: true }
);

ProductoSchema.methods.toJSON = function () {
  const { __v, estado, _id, ...data } = this.toObject();
  data.uid = _id;
  return data;
};

export default model("productoModelo", ProductoSchema);