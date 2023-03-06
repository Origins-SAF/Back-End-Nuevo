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
      categoria: {
        type: Schema.Types.ObjectId,
        ref: "Categoria",
        required: true,
      },
      destino: {
        type: Schema.Types.ObjectId,
        ref: "Destino",
        required: true,
      },
      img: { type: String },
    }],
    proveedor: {
      type: Schema.Types.ObjectId,
      ref: "usuarioModelo",
      required: true,
    },
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
