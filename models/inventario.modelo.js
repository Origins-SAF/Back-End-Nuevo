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
      ref: "Usuario",
      required: true,
    },
    
    productos:[{

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
    destino: [
      {
        punto: {
          type: Schema.Types.ObjectId,
          ref: "Punto",
          required: true,
        },
        cantidadDestino: {
          type: Number,
          required: true,
        },
      },
    ],
  }],
    proveedor: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    /* disponible: { type: Boolean, default: true }, */
    img: { type: String },
  },
  { timestamps: true }
);


 
InventarioSchema.methods.toJSON = function () {
  const { __v, estado, _id, ...data } = this.toObject();
  data.uid = _id;
  return data;
};

export default model("inventarioModelo", InventarioSchema);
