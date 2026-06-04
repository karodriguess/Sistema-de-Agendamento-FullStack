import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    senha: {
      type: String,
      required: true,
    },

    perfil: {
      type: String,
      enum: ["admin", "cliente"],
      default: "cliente",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
