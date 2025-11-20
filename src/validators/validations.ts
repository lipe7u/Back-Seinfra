import { z } from "zod";

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
}

const imagemUrlSchema = z.string()
    .url(validationsMessages.Imagem.InvalidUrl)
    .refine((url) => {
      const imageExtensions = [".jpg", ".jpeg", ".png", ".gif"]
      return imageExtensions.some(ext => url.toLowerCase().includes(ext))
    }, validationsMessages.Imagem.InvalidType)
    .optional()

export const CriarSolicitacaoSchema = z.object({
  endereco: z.string()
    .min(1,validationsMessages.Endereco.Required)
    .min(5, validationsMessages.Endereco.Min)
    .max(300, validationsMessages.Endereco.Max),
  
    pontoReferencia: z.string()
    .optional(),
  
    descricao: z.string()
    .min(1, validationsMessages.Descricao.Required)
    .min(10,validationsMessages.Descricao.Min)
    .max(1000, validationsMessages.Descricao.Max),
  
    imagemUrl: imagemUrlSchema,
});

export const idSchema = z.object({
  id: z.string().uuid(),
});
