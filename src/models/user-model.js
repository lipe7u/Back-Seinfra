"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const registroUsuario = async (data) => {
    if (!data.cpf) {
        throw new Error("Cpf já cadastrado!");
    }
    if (!data.telefone) {
        throw new Error("Telefone já cadastrado!");
    }
};
