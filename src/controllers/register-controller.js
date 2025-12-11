"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const register_service_1 = require("../services/register-service");
const register = async (request, reply) => {
    try {
        const user = await (0, register_service_1.registerUserService)(request.body);
        reply.code(201).send(user);
    }
    catch (error) {
        const MensagemDeError = error instanceof Error ? error.message : "Erro de registro de usuário";
        reply.code(400).send({ error: MensagemDeError });
    }
};
exports.register = register;
