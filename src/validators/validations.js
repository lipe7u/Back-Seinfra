"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.idSchema = exports.CriarSolicitacaoSchema = void 0;
const zod_1 = require("zod");
const validationsMessages = {
    Endereco: {
        Required: "Endereço é obrigatório",
        Min: "Endereço deve ter pelo menos 5 caracteres",
        Max: "Endereço inválido"
    },
    PontoReferencia: {
        Max: "Ponto de referência muito longo (máximo 200 caracteres)"
    },
    Descricao: {
        Required: "Descrição é obrigatória",
        Min: "Descreva o ocorrido com pelo menos 10 caracteres",
        Max: "Descrição muito longa (máximo 1000 caracteres)"
    },
    Imagem: {
        InvalidUrl: "URL da imagem inválida",
        InvalidType: "A URL deve ser de uma imagem (jpg, jpeg, png, gif)"
    },
};
const imagemUrlSchema = zod_1.z.string()
    .url(validationsMessages.Imagem.InvalidUrl)
    .refine((url) => {
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif"];
    return imageExtensions.some(ext => url.toLowerCase().includes(ext));
}, validationsMessages.Imagem.InvalidType)
    .optional();
exports.CriarSolicitacaoSchema = zod_1.z.object({
    endereco: zod_1.z.string()
        .min(1, validationsMessages.Endereco.Required)
        .min(5, validationsMessages.Endereco.Min)
        .max(300, validationsMessages.Endereco.Max),
    pontoReferencia: zod_1.z.string()
        .optional(),
    descricao: zod_1.z.string()
        .min(1, validationsMessages.Descricao.Required)
        .min(10, validationsMessages.Descricao.Min)
        .max(1000, validationsMessages.Descricao.Max),
    imagemUrl: imagemUrlSchema,
});
exports.idSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
});
