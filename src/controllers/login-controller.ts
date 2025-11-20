import { FastifyRequest, FastifyReply } from "fastify";
import { loginUserService } from "../services/login-service";
import { LoginB } from "../interface/auth-interfaces";

export const login = async (
  request: FastifyRequest<{ Body: LoginB }>,
  reply: FastifyReply
) => {
  try {
    const token = await loginUserService(reply.server, request.body);
    reply.send({ token });
  } catch (error) {
    const MensagemDeError =
      error instanceof Error ? error.message : "Erro de login de usuário";
    reply.code(401).send({ error: MensagemDeError });
  }
};
