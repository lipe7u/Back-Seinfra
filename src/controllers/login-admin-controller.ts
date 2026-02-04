import { FastifyRequest, FastifyReply } from "fastify";
import { loginAdminService } from "../services/login-service"
import { LoginAdminB } from "../interface/auth-interfaces";
import { success } from "zod/v4";

export const loginAdmin = async (
  request: FastifyRequest<{ Body: LoginAdminB }>,
  reply: FastifyReply
) => {
  try {
    const token = await loginAdminService(reply.server, request.body);
    reply.setCookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60,
      sameSite: "lax",
      path: "/login",
    }).send({ success:true })
  } catch (error) {
    const mensagem = error instanceof Error ? error.message : "Erro no login";
    reply.code(401).send({ error: mensagem });
  }
}; 