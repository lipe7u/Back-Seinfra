import { z } from "zod"

export const criarSolicitacaoSchema = z.object({
  endereco: z.string().min(1,"Endereço invalido"),
  pontoReferencia: z.string().optional(),
  descricao: z.string().min(5, "Descreva o ocorrido com pelo menos 5 caracteres"),
  imagemUrl: z.string().url().optional(),
})

export const idSchema = z.object({
  id: z.string().uuid(),
})
