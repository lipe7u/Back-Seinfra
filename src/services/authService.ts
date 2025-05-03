import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";
import { FastifyInstance } from "fastify";
import fastifyJwt from "fastify-jwt";

const prisma = new PrismaClient();

export const registroUser  = async (data: {
  cpf: string;
  nome: string;
  telefone: string;
  senha: string;
}) => {
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

export const loginUser  = async (
  app: FastifyInstance,
  data: { cpf?: string; telefone?: string; senha: string }
) => {
  try {
    const user = data.cpf
      ? await prisma.usuarios.findUnique({ where: { cpf: data.cpf } })
      : await prisma.usuarios.findFirst({ where: { telefone: data.telefone } });

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    if (!user.senha_hash) {
      throw new Error("Senha não encontrada");
    }

    const isPasswordValid = await bcrypt.compare(data.senha, user.senha_hash);
    if (!isPasswordValid) {
      throw new Error("Erro no credenciamento");
    }

    const token = app.jwt.sign({ id: user.id_user, Admin: user.Admin });
    return token;
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    throw new Error("Erro ao fazer login");
  }
};

export const registroAdmin = async (data: {
  cpf: string;
  senha: string;
  telefone: string; 
}) => {
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