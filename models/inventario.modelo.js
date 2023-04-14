import { model, Schema } from 'mongoose';

const InventarioSchema = new Schema(
  {
    estado: {
      type: Boolean,
      default: true,
      required: true,
    },
    usuario: {
      type: Schema.Types.ObjectId,
      ref: "usuarioModelo",
      required: true,
    },
    distribuidor: {
      type: Schema.Types.ObjectId,
      ref: "distribuidorModelo",
    },

    productos: [{

      nombre: {
        type: String,
        required: [true, "El nombre es obligatorio"],
        /*  unique: true, */
      },

      unidad: {
        type: String,
        default: "UN",
      },

      cantidadProducto: {
        type: Number,
        default: 0,

      },
      precio: {
        type: Number,
        default: 0,
      },
      destino: {
        type: Schema.Types.ObjectId,
        ref: "PuntoModelo",
        required: true,
      },
      img: { type: String, default:"https://images.vexels.com/media/users/3/199820/isolated/preview/892bfdfcb80b356c53405aafbb716513-caja-de-carton-isometrica.png"},
    }],
    totalDeProductos: {
      type: Number
    }
    /* disponible: { type: Boolean, default: true }, */
  },
  { timestamps: true }
);



InventarioSchema.methods.toJSON = function () {
  const { __v, estado, _id, ...data } = this.toObject();
  data.uid = _id;
  return data;
};

export default model("inventarioModelo", InventarioSchema);
