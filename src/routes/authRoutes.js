"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = authRoutes;
const authController_1 = require("../controllers/authController");
const solicitacoes_1 = require("../controllers/solicitacoes");
async function authRoutes(fastify) {
    console.log("Rotas de autenticação e solicitação registradas!");
    fastify.post("/registro", authController_1.registro);
    fastify.post("/login", authController_1.login);
    fastify.post("/registro-admin", authController_1.registrarAdmin);
    fastify.post("/novaSolicitacao", solicitacoes_1.criarSolicitacao);
    fastify.get("/minhas-solicitacoes", solicitacoes_1.listarMinhasSolicitacoes);
}
