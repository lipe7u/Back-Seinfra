import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";
import { FastifyInstance } from "fastify";
import fastifyJwt from "fastify-jwt";

// Cria uma instância do cliente Prisma para interagir com o banco de dados
const prisma = new PrismaClient();

// Função para registrar um novo usuário
export const registroUser  = async (data: {
  cpf: string; // CPF do usuário
  nome: string; // Nome do usuário
  telefone: string; // Telefone do usuário
  senha: string; // Senha do usuário
}) => {
  try {
    // Faz o hash da senha usando bcrypt com um custo de 10
    const senhaHashed = await bcrypt.hash(data.senha, 10);
    
    // Cria um novo usuário no banco de dados
    const user = await prisma.usuarios.create({
      data: {
        cpf: data.cpf,
        nome: data.nome,
        telefone: data.telefone,
        senha_hash: senhaHashed, // Armazena a senha hasheada
      },
    });
    
    // Retorna o usuário criado
    return user;
  } catch (error) {
    console.error("Erro ao registrar usuário:", error); // Log de erro
    throw new Error("Erro ao registrar usuário"); // Log de um erro
  }
};

// Função para fazer login de um usuário
export const loginUser  = async (
  app: FastifyInstance, // Instância do Fastify para gerar o token
  data: { cpf?: string; telefone?: string; senha: string } // Dados de login
) => {
  try {
    // Busca o usuário pelo CPF ou telefone, dependendo do que foi fornecido
    const user = data.cpf
      ? await prisma.usuarios.findUnique({ where: { cpf: data.cpf } })
      : await prisma.usuarios.findFirst({ where: { telefone: data.telefone } });

    // Verifica se o usuário foi encontrado
    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    // Verifica se a senha hash está presente
    if (!user.senha_hash) {
      throw new Error("Senha não encontrada");
    }

    // Compara a senha fornecida com a senha hasheada armazenada
    const isPasswordValid = await bcrypt.compare(data.senha, user.senha_hash);
    if (!isPasswordValid) {
      throw new Error("Erro no credenciamento");
    }

    // Gera um token JWT com o ID do usuário e se é admin
    const token = app.jwt.sign({ id: user.id_user, Admin: user.Admin });
    return token; // Retorna o token gerado
  } catch (error) {
    console.error("Erro ao fazer login:", error); // Log de erro
    throw new Error("Erro ao fazer login"); // Log de um erro
  }
};

// Função para registrar um novo administrador
export const registroAdmin = async (data: {
  cpf: string; // CPF do administrador
  senha: string; // Senha do administrador
  telefone: string; // Telefone do administrador
}) => {
  try {
    // Faz o hash da senha usando bcrypt com um custo de 10
    const senhaHashed = await bcrypt.hash(data.senha, 10);
    
    // Cria um novo administrador no banco de dados
    const admin = await prisma.usuarios.create({
      data: {
        cpf: data.cpf,
        senha_hash: senhaHashed, // Armazena a senha hasheada
        telefone: data.telefone,
        Admin: true, // Marca o usuário como administrador
      },
    });
    
    // Retorna o administrador criado
    return admin;
  } catch (error) {
    console.error("Erro ao registrar admin:", error); // Log de erro
    throw new Error("Erro ao registrar admin"); // Log de um erro
  }
};
