import { RegisterB, LoginB } from "../interface/auth-interfaces";

const registroUsuario = async (data: RegisterB) => {
  if (!data.cpf) {
    throw new Error("Cpf já cadastrado!");
  }

  if (!data.telefone) {
    throw new Error("Telefone já cadastrado!");
  }
};
