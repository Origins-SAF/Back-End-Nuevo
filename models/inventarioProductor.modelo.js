import { model, Schema } from "mongoose";

const InventarioProductorSchema = new Schema(
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
    productores: {
      type: String,
      required: true,
    },
    productos: [
      {
        producto: {
          type: String,
          required: true,
        },
        imgProducto: {
          type: String,
          required: true,
        },
        cantidadProducto: {
          type: String,
        },

        precio: {
          type: Number,
          default: 0,
        },
      },
    ],

    totalDeProductos: {
      type: Number,
    },
    /* disponible: { type: Boolean, default: true }, */
  },
  { timestamps: true }
);

InventarioProductorSchema.methods.toJSON = function () {
  const { __v, estado, _id, ...data } = this.toObject();
  data.uid = _id;
  return data;
};

export default model("inventarioProductorModelo", InventarioProductorSchema);
