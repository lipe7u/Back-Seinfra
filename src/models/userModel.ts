import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { FastifyInstance } from "fastify";
import { registroUser , loginUser  } from "../services/authService"; 
import { RegistroB, LoginB } from "../interface/interfaces";

// Cria uma instância do cliente Prisma para interagir com o banco de dados
const prisma = new PrismaClient();

// Função para registrar um novo usuário
const registroUsuario = async (data: {
    cpf: string; // CPF do usuário
    nome: string; // Nome do usuário
    telefone: string; // Telefone do usuário
    senha: string; // Senha do usuário
}) => {
    // Verifica se o CPF foi fornecido
    if (!data.cpf) {
        throw new Error("Cpf já cadastrado!"); // Lança um erro se o CPF não estiver presente
    }
    
    // Verifica se o telefone foi fornecido
    if (!data.telefone) {
        throw new Error("Telefone já cadastrado!"); // Lança um erro se o telefone não estiver presente
    }
};

// A função 'registroUsuario' não realiza a lógica de registro no banco de dados.
// Ela apenas verifica se o CPF e o telefone foram fornecidos, mas não verifica se eles já estão cadastrados.
