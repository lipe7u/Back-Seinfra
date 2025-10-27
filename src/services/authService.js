"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.registroAdmin = exports.loginUser = exports.registroUser = void 0;
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcryptjs"));
// Cria uma instância do cliente Prisma para interagir com o banco de dados
const prisma = new client_1.PrismaClient();
// Função para registrar um novo usuário
const registroUser = async (data) => {
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
    }
    catch (error) {
        console.error("Erro ao registrar usuário:", error); // Log de erro
        throw new Error("Erro ao registrar usuário"); // Log de um erro
    }
};
exports.registroUser = registroUser;
// Função para fazer login de um usuário
const loginUser = async (app, // Instância do Fastify para gerar o token
data // Dados de login
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
    }
    catch (error) {
        console.error("Erro ao fazer login:", error); // Log de erro
        throw new Error("Erro ao fazer login"); // Log de um erro
    }
};
exports.loginUser = loginUser;
// Função para registrar um novo administrador
const registroAdmin = async (data) => {
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
    }
    catch (error) {
        console.error("Erro ao registrar admin:", error); // Log de erro
        throw new Error("Erro ao registrar admin"); // Log de um erro
    }
};
exports.registroAdmin = registroAdmin;
