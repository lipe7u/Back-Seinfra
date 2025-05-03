import { FastifyRequest, FastifyReply } from "fastify";
import { registroUser , loginUser , registroAdmin } from "../services/authService";
import { RegistroB, LoginB, RegistroAdminB } from "../interface/interfaces";

export const registro = async (
  request: FastifyRequest<{ Body: RegistroB }>,
  reply: FastifyReply
) => {
  try {
    const user = await registroUser (request.body);
    reply.code(201).send(user);
  } catch (error) {
    const MensagemDeError =
      error instanceof Error ? error.message : "Erro de registro de usuário";
    reply.code(400).send({ error: MensagemDeError });
  }
};

export const login = async (
  request: FastifyRequest<{ Body: LoginB }>,
  reply: FastifyReply
) => {
  try {
    const token = await loginUser (reply.server, request.body);
    reply.send({ token });
  } catch (error) {
    const MensagemDeError =
      error instanceof Error ? error.message : "Erro de login de usuário";
    reply.code(401).send({ error: MensagemDeError });
  }
};

export const registrarAdmin = async (
  request: FastifyRequest<{ Body: RegistroAdminB }>,
  reply: FastifyReply
) => {
  try {
    const admin = await registroAdmin(request.body);
    reply.code(201).send(admin);
  } catch (error) {
    const MensagemDeError =
      error instanceof Error ? error.message : "Erro ao registrar admin";
    reply.code(400).send({ error: MensagemDeError });
  }
};