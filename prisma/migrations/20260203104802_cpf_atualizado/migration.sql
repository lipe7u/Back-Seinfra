/*
  Warnings:

  - You are about to alter the column `cpf` on the `usuarios` table. The data in that column could be lost. The data in that column will be cast from `Char(14)` to `Char(11)`.

*/
-- AlterTable
ALTER TABLE "registro_ordens" ADD COLUMN     "Justificativa" TEXT;

-- AlterTable
ALTER TABLE "usuarios" ALTER COLUMN "cpf" SET DATA TYPE CHAR(11);
