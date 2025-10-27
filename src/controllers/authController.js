"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registrarAdmin = exports.login = exports.registro = void 0;
const authService_1 = require("../services/authService");
// Função para registrar um novo usuário
const registro = async (request, // Tipagem da requisição para incluir o corpo da solicitação
reply // Tipagem da resposta
) => {
    try {
        const user = await (0, authService_1.registroUser)(request.body); // Chama a função de registro de usuário passando os dados do corpo da requisição
        reply.code(201).send(user); // Retorna uma resposta de sucesso com o código 201 e os dados do usuário criado
    }
    catch (error) {
        // Se ocorrer um erro, formata a mensagem de erro
        const MensagemDeError = error instanceof Error ? error.message : "Erro de registro de usuário";
        reply.code(400).send({ error: MensagemDeError }); // Retorna um erro 400 com a mensagem formatada
    }
};
exports.registro = registro;
// Função para fazer login de um usuário
const login = async (request, // Tipagem da requisição para incluir o corpo da solicitação
reply // Tipagem da resposta
) => {
    try {
        const token = await (0, authService_1.loginUser)(reply.server, request.body); // Chama a função de login passando os dados do corpo da requisição e a instância do servidor
        reply.send({ token }); // Retorna o token gerado em uma resposta de sucesso
    }
    catch (error) {
        const MensagemDeError = error instanceof Error ? error.message : "Erro de login de usuário"; // Se ocorrer um erro, formata a mensagem de erro
        reply.code(401).send({ error: MensagemDeError }); // Retorna um erro 401 com a mensagem formatada
    }
};
exports.login = login;
// Função para registrar um novo administrador
const registrarAdmin = async (request, // Tipagem da requisição para incluir o corpo da solicitação
reply // Tipagem da resposta
) => {
    try {
        const admin = await (0, authService_1.registroAdmin)(request.body); // Chama a função de registro de administrador passando os dados do corpo da requisição
        reply.code(201).send(admin); // Retorna uma resposta de sucesso com o código 201 e os dados do administrador criado
    }
    catch (error) {
        const MensagemDeError = error instanceof Error ? error.message : "Erro ao registrar admin"; // Se ocorrer um erro, formata a mensagem de erro
        reply.code(400).send({ error: MensagemDeError }); // Retorna um erro 400 com a mensagem formatada;
    }
};
exports.registrarAdmin = registrarAdmin;
