"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = authRoutes;
const authController_1 = require("../controllers/authController");
const solicitacoes_1 = require("../controllers/solicitacoes");
// Função que define as rotas de autenticação e solicitações
async function authRoutes(fastify) {
    console.log("Rotas de autenticação e solicitação registradas!"); // Log para indicar que as rotas foram registradas
    fastify.post("/registro", authController_1.registro); // Rota para registrar um novo usuário
    fastify.post("/login", authController_1.login); // Rota para fazer login de um usuário
    fastify.post("/registro-admin", authController_1.registrarAdmin); // Rota para registrar um novo administrador
    fastify.post("/novaSolicitacao", solicitacoes_1.criarSolicitacao); // Rota para criar uma nova solicitação
    fastify.get("/minhas-solicitacoes", solicitacoes_1.listarMinhasSolicitacoes); // Rota para listar as solicitações do usuário autenticado
}
