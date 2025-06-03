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
const prisma = new client_1.PrismaClient();
const registroUser = async (data) => {
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
    }
    catch (error) {
        console.error("Erro ao registrar usuário:", error);
        throw new Error("Erro ao registrar usuário");
    }
};
exports.registroUser = registroUser;
const loginUser = async (app, data) => {
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
    }
    catch (error) {
        console.error("Erro ao fazer login:", error);
        throw new Error("Erro ao fazer login");
    }
};
exports.loginUser = loginUser;
const registroAdmin = async (data) => {
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
    }
    catch (error) {
        console.error("Erro ao registrar admin:", error);
        throw new Error("Erro ao registrar admin");
    }
};
exports.registroAdmin = registroAdmin;
