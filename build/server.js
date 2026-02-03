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
exports.prisma = exports.app = void 0;
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const fastify_jwt_1 = __importDefault(require("fastify-jwt"));
const client_1 = require("@prisma/client");
const dotenv = __importStar(require("dotenv"));
const global_routes_1 = __importDefault(require("./routes/global-routes"));
dotenv.config();
exports.app = (0, fastify_1.default)();
exports.prisma = new client_1.PrismaClient();
if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET não encontrado no .env");
}
exports.app.register(fastify_jwt_1.default, {
    secret: process.env.JWT_SECRET,
});
exports.app.register(global_routes_1.default);
exports.app.addHook("preHandler", async (request, reply) => {
    console.log("======== ROTA RECEBIDA ========");
    console.log("method:", request.method);
    console.log("url:", request.url);
    console.log("================================");
    const rota = request.url.split("?")[0];
    const rotasPublicas = [
        "/registro",
        "/login",
        "/registro-admin",
        "/login-admin",
    ];
    if (rotasPublicas.includes(rota)) {
        return;
    }
    try {
        await request.jwtVerify();
    }
    catch (_a) {
        return reply.code(401).send({
            statusCode: 401,
            error: "Unauthorized",
            message: "Token inválido ou ausente",
        });
    }
});
exports.app.register(cors_1.default, {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Origin", "Accept"],
});
const port = Number(process.env.PORT) || 3000;
const start = async () => {
    try {
        await exports.app.listen({ port, host: "0.0.0.0" });
        console.log("Servidor rodando em: http://localhost:${port}");
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
};
start();
