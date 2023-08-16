import { Schema, model } from "mongoose";

const LogSchema = new Schema({
  descripcion: {
    type: String,
  },
});

LogSchema.methods.toJSON = function () {
    const { __v, estado, _id, ...data } = this.toObject();
    data.uid = _id;
    return data;
  };
  
  export default model("logModelo", LogSchema);