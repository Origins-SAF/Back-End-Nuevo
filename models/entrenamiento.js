import { Schema, model } from "mongoose";

const entrenamientoSchema = new Schema({
  producto: {
    type: String,
  },
  pesoEnKilo: {
    type: Number,
  }
});

entrenamientoSchema.methods.toJSON = function () {
    const { __v, estado, _id, ...data } = this.toObject();
    data.uid = _id;
    return data;
  };
  
  export default model("entrenamientoModelo", entrenamientoSchema);