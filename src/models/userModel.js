"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const registroUsuario = async (data) => {
    if (!data.cpf) {
        throw new Error("Cpf já cadastrado!");
    }
    if (!data.telefone) {
        throw new Error("Telefone já cadastrado!");
    }
};
