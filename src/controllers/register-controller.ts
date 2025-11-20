import { FastifyRequest, FastifyReply } from "fastify";
import { registerUserService } from "../services/register-service";
import { RegisterB } from "../interface/auth-interfaces";

export const register = async (
  request: FastifyRequest<{ Body: RegisterB }>,
  reply: FastifyReply
) => {
  try {
    const user = await registerUserService(request.body);
    reply.code(201).send(user);
  } catch (error) {
    const MensagemDeError =
      error instanceof Error ? error.message : "Erro de registro de usuário";
    reply.code(400).send({ error: MensagemDeError });
  }
};
