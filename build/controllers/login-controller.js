"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const login_service_1 = require("../services/login-service");
const login = async (request, reply) => {
    try {
        const token = await (0, login_service_1.loginUserService)(reply.server, request.body);
        reply.setCookie("token", token, {
            httpOnly: true,
            secure: false,
            maxAge: 24 * 60 * 60,
            sameSite: "lax",
            path: "/",
        }).send({ success: true });
    }
    catch (error) {
        const MensagemDeError = error instanceof Error ? error.message : "Erro de login de usuário";
        reply.code(401).send({ error: MensagemDeError });
    }
};
exports.login = login;
