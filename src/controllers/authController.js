"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registrarAdmin = exports.login = exports.registro = void 0;
const authService_1 = require("../services/authService");
const registro = async (request, reply) => {
    try {
        const user = await (0, authService_1.registroUser)(request.body);
        reply.code(201).send(user);
    }
    catch (error) {
        const MensagemDeError = error instanceof Error ? error.message : "Erro de registro de usuário";
        reply.code(400).send({ error: MensagemDeError });
    }
};
exports.registro = registro;
const login = async (request, reply) => {
    try {
        const token = await (0, authService_1.loginUser)(reply.server, request.body);
        reply.send({ token });
    }
    catch (error) {
        const MensagemDeError = error instanceof Error ? error.message : "Erro de login de usuário";
        reply.code(401).send({ error: MensagemDeError });
    }
};
exports.login = login;
const registrarAdmin = async (request, reply) => {
    try {
        const admin = await (0, authService_1.registroAdmin)(request.body);
        reply.code(201).send(admin);
    }
    catch (error) {
        const MensagemDeError = error instanceof Error ? error.message : "Erro ao registrar admin";
        reply.code(400).send({ error: MensagemDeError });
    }
};
exports.registrarAdmin = registrarAdmin;
