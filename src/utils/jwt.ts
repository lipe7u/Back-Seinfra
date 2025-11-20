import { FastifyInstance } from "fastify";
import * as dotenv from "dotenv";

dotenv.config();

const secret = process.env.JWT_SECRET;

export const registerJwt = (app: FastifyInstance) => {
  if (!secret) {
    throw new Error("ocorreu um erro no JWT_SECRET");
  }

  app.register(import("fastify-jwt"), {
    secret: secret,
  });
};


export const signToken = (pl: object) => {
  return { token: pl };
};


export const verifyToken = (token: string) => {
  return token;
};
