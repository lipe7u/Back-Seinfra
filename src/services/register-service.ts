import * as bcrypt from "bcryptjs";
import { RegisterAdminB, RegisterB } from "../interface/auth-interfaces";
import { prisma } from "../server";
import { validarCPF } from "../utils/cpf-validation";

export const registerUserService = async (data: RegisterB) => {
  try {
    const cpfLimpo = data.cpf.replace(/\D/g, '')
    if(!validarCPF(cpfLimpo)){
      throw new Error("CPF INVALIDO")
    }
    
    const existeCpf = await prisma.usuarios.findUnique({
      where: { cpf: cpfLimpo },
    });

    if (existeCpf) {
      throw new Error("CPF já cadastrado");
    }

    const senhaHashed = await bcrypt.hash(data.senha, 10);
    
    const user = await prisma.usuarios.create({
      data: {
        cpf: cpfLimpo,
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
    const cpfLimpo = data.cpf.replace(/\D/g, '')
    if(!validarCPF(cpfLimpo)){
      throw new Error("CPF INVALIDO")
    }
    
    const existeCpf = await prisma.usuarios.findUnique({
      where: { cpf: cpfLimpo },
    });

    if (existeCpf) {
      throw new Error("CPF já cadastrado");
    }
    
    const senhaHashed = await bcrypt.hash(data.senha, 10);
    const admin = await prisma.usuarios.create({
      data: {
        cpf: cpfLimpo,
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
