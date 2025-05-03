import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs"
import { FastifyInstance } from "fastify";
import { registroUser, loginUser } from "../services/authService"; 
import { RegistroB, LoginB } from "../interface/interfaces";

const prisma = new PrismaClient();

const registroUsuario = async (data: {
    cpf: string;
    nome: string;
    telefone: string;
    senha: string; }) => {
        if (!data.cpf){
            throw new Error ("Cpf já cadastrado!")
        }
        
        if (!data.telefone) {
               throw new Error ("Telefone já cadastrado!")
        }
    }
     
    


