import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.usuarios.createMany({
    data: [
      { 
        nome: 'Maria', 
        telefone: '11999999999', 
        cpf: '093.426.753-09', 
        senha_hash: 'senha123' 
      },
      { 
        nome: 'João', 
        telefone: '113878888', 
        cpf: '087.224.935-00', 
        senha_hash: 'senha456' 
      },
    ],
    skipDuplicates: true, // Evita erro se os dados já existirem
  });
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());