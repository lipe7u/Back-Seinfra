"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerAdmin = void 0;
const register_service_1 = require("../services/register-service");
const registerAdmin = async (request, reply) => {
    try {
        const admin = await (0, register_service_1.registerAdminService)(request.body);
        reply.code(201).send(admin);
    }
    catch (error) {
        const MensagemDeError = error instanceof Error ? error.message : "Erro ao registrar admin";
        reply.code(400).send({ error: MensagemDeError });
    }
};
exports.registerAdmin = registerAdmin;
