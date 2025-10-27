"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
// Cria uma instância do cliente Prisma para interagir com o banco de dados
const prisma = new client_1.PrismaClient();
// Função para registrar um novo usuário
const registroUsuario = async (data) => {
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
