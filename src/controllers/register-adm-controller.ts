import { FastifyRequest, FastifyReply } from "fastify";
import { registerAdminService } from "../services/register-service";
import { RegisterAdminB } from "../interface/auth-interfaces";

export const registerAdmin = async (
  request: FastifyRequest<{ Body: RegisterAdminB }>,
  reply: FastifyReply
) => {
  try {
    const admin = await registerAdminService(request.body);
    reply.code(201).send(admin);
  } catch (error) {
    const MensagemDeError =
      error instanceof Error ? error.message : "Erro ao registrar admin";
    reply.code(400).send({ error: MensagemDeError });
  }
};
