import { Schema, model } from "mongoose";

const RoleSchema = new Schema({
  rol: {
    type: String,
    required: [true, "El rol es obligatorio"],
  },
});

RoleSchema.methods.toJSON = function () {
    const { __v, estado, _id, ...data } = this.toObject();
    data.uid = _id;
    return data;
  };
  
  export default model("rolModelo", RoleSchema);
  