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
exports.loginAdminService = exports.loginUserService = void 0;
const bcrypt = __importStar(require("bcryptjs"));
const server_1 = require("../server");
const loginUserService = async (app, data) => {
    try {
        const user = data.cpf
            ? await server_1.prisma.usuarios.findUnique({ where: { cpf: data.cpf } })
            : await server_1.prisma.usuarios.findFirst({ where: { telefone: data.telefone } });
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
exports.loginUserService = loginUserService;
const loginAdminService = async (app, data) => {
    const admin = await server_1.prisma.usuarios.findUnique({
        where: { cpf: data.cpf },
    });
    if (!admin || !admin.Admin) {
        throw new Error("Admin não encontrado");
    }
    const senhaValida = await bcrypt.compare(data.senha, admin.senha_hash || "");
    if (!senhaValida) {
        throw new Error("Senha incorreta");
    }
    const token = app.jwt.sign({ id: admin.id_user, Admin: admin.Admin });
    return token;
};
exports.loginAdminService = loginAdminService;
