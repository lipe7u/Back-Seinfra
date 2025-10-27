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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const fastify_1 = __importDefault(require("fastify"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const dotenv = __importStar(require("dotenv"));
const cors_1 = __importDefault(require("@fastify/cors"));
const fastify_jwt_1 = __importDefault(require("fastify-jwt"));
// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();
// Cria uma instância do servidor Fastify
const app = (0, fastify_1.default)();
// Cria uma instância do cliente Prisma para interagir com o banco de dados
const prisma = new client_1.PrismaClient();
// Verifica se a variável de ambiente JWT_SECRET está definida
if (!process.env.JWT_SECRET) {
    throw new Error("ocorreu um erro no JWT_SECRET"); // Lança um erro se a variável não estiver definida
}
// Registra o plugin fastify-jwt com a chave secreta para assinar os tokens
app.register(fastify_jwt_1.default, {
    secret: process.env.JWT_SECRET,
});
// Registra as rotas de autenticação
app.register(authRoutes_1.default);
// Middleware que verifica o token JWT apenas nas rotas que precisam de autenticação
app.addHook("preHandler", async (request, reply) => {
    // Verifica se a rota é uma que requer autenticação
    if (request.url !== "/registro" && request.url !== "/login") {
        try {
            await request.jwtVerify(); // Verifica o token JWT
        }
        catch (err) {
            reply.send(err); // Se o token não for válido, retorna o erro
        }
    }
});
// Registra o plugin CORS para permitir requisições de diferentes origens
app.register(cors_1.default, {
    origin: "*", // Permite requisições de qualquer origem
    methods: ["GET", "POST", "PUT", "DELETE"], // Métodos HTTP permitidos
    allowedHeaders: ["Content-Type", "Authorization", "Origin", "Accept"], // Cabeçalhos permitidos
});
// Função para iniciar o servidor
const start = async () => {
    try {
        // Inicia o servidor na porta 3000
        await app.listen({ port: 3000 });
        console.log("Servidor rodando em: http://localhost:3000"); // Log de confirmação
    }
    catch (err) {
        console.error(err); // Log de erro se a inicialização falhar
        process.exit(1); // Encerra o processo com erro
    }
};
// Chama a função para iniciar o servidor
start();
