import { model, Schema } from 'mongoose';

const UsuarioSchema = new Schema(
  {
    usuario: {
      type: String,
      required: [true, "El usuario es obligatorio"],
    },
    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio"],
    },
    apellido: {
      type: String,
      required: [true, "El apellido es obligatorio"],
    },
    correo: {
      type: String,
      required: [true, "El correo es obligatorio"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "La contraseña es obligatoria"],
    },
    description:{
      type: String,
      default: "Trabajador del SAF",
    },
    ubicacion: {
      puntoFijo:{
        type: Schema.Types.ObjectId,
        ref: "PuntoModelo"
      },
      todosLosPuntos:{
        type: Boolean,
        default: false
      }
    },
    img: {
      type: String,
    },
    rol: {
      type: Schema.Types.ObjectId,
      ref: "rolModelo",
      default: "647dff4d15499b8a9d423119",
    },
    configuraciones:{
        colorNavbar: {
          type: String,
          default: 'colorDefault'
      },
        colorSiderBar:{
          type: String,
          default: 'sidebar-custom-theme'
        }
    },
    estado: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

UsuarioSchema.methods.toJSON = function () {
  const { __v, password, _id, ...usuario } = this.toObject();
  usuario.uid = _id;
  return usuario;
};

export default model("usuarioModelo", UsuarioSchema);
