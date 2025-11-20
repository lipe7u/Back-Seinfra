import * as bcrypt from "bcryptjs";
import { RegisterAdminB, RegisterB } from "../interface/auth-interfaces";
import { prisma } from "../server";

export const registerUserService = async (data: RegisterB) => {
  try {
    const senhaHashed = await bcrypt.hash(data.senha, 10);
    const user = await prisma.usuarios.create({
      data: {
        cpf: data.cpf,
        nome: data.nome,
        telefone: data.telefone,
        senha_hash: senhaHashed,
      },
    });
    return user;
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    throw new Error("Erro ao registrar usuário");
  }
};

export const registerAdminService = async (data: RegisterAdminB) => {
  try {
    const senhaHashed = await bcrypt.hash(data.senha, 10);
    const admin = await prisma.usuarios.create({
      data: {
        cpf: data.cpf,
        senha_hash: senhaHashed,
        telefone: data.telefone,
        Admin: true,
      },
    });
    return admin;
  } catch (error) {
    console.error("Erro ao registrar admin:", error);
    throw new Error("Erro ao registrar admin");
  }
};
