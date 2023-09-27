import { Schema, model } from "mongoose";

const SemanaSchema = new Schema({
  nombre: {
    type: String,
  },
  nroSemana: {
    type: Number,
  },
  activo: {
    type: Boolean,
  },
});

SemanaSchema.methods.toJSON = function () {
    const { __v, estado, _id, ...data } = this.toObject();
    data.uid = _id;
    return data;
  };
  
  export default model("semanaModelo", SemanaSchema);