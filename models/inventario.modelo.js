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
    destino: {
      type: Schema.Types.ObjectId,
      ref: "PuntoModelo",
      required: true,
    },
    productos: [{

      producto: {
        type: Schema.Types.ObjectId,
        ref: "productoModelo",
      },

      distribuidor: {
        type: Schema.Types.ObjectId,
        ref: "distribuidorModelo",
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
