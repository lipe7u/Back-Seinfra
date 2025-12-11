import { FastifyRequest, FastifyReply } from "fastify";
import { loginAdminService } from "../services/login-service"
import { LoginAdminB } from "../interface/auth-interfaces";

export const loginAdmin = async (
  request: FastifyRequest<{ Body: LoginAdminB }>,
  reply: FastifyReply
) => {
  try {
    const admin = await loginAdminService(request.body);
    reply.code(200).send(admin);
  } catch (error) {
    const mensagem = error instanceof Error ? error.message : "Erro no login";
    reply.code(401).send({ error: mensagem });
  }
};