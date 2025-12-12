import * as bcrypt from "bcryptjs";
import { FastifyInstance } from "fastify";
import { LoginAdminB, LoginB } from "../interface/auth-interfaces";
import { prisma } from "../server";

export const loginUserService = async (app: FastifyInstance, data: LoginB) => {
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

export const loginAdminService = async (app: FastifyInstance, data: LoginAdminB) => {
  const admin = await prisma.usuarios.findUnique({
    where: { cpf: data.cpf },
  });
  if (!admin || !admin.Admin) {
    throw new Error("Admin não encontrado");
  }
  const senhaValida = await bcrypt.compare(data.senha, admin.senha_hash || "");
  if (!senhaValida) {
    throw new Error("Senha incorreta");
  }
  const token = app.jwt.sign({id: admin.id_user, Admin: admin.Admin})
  return token
};

