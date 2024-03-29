import { Schema, model } from "mongoose";

const PuntoSchema = new Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio"],
    },
    departamento: {
      type: String,
    },
    barrio: {
      type: String,
    },
    usuario: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    descripcion: { type: String },
    ubicacion: {
      lat: {
        type: String,
      },
      lon: {
        type: String,
      },
    },
    estado: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

PuntoSchema.methods.toJSON = function () {
  const { __v, estado, _id, ...data } = this.toObject();
  data.uid = _id;
  return data;
};


export default model("PuntoModelo", PuntoSchema);
