"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.idSchema = exports.criarSolicitacaoSchema = void 0;
const zod_1 = require("zod");
exports.criarSolicitacaoSchema = zod_1.z.object({
    endereco: zod_1.z.string().min(1, "Endereço invalido"),
    pontoReferencia: zod_1.z.string().optional(),
    descricao: zod_1.z.string().min(5, "Descreva o ocorrido com pelo menos 5 caracteres"),
    imagemUrl: zod_1.z.string().url().optional(),
});
exports.idSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
});
