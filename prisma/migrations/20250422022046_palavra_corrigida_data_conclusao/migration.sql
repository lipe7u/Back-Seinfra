/*
  Warnings:

  - You are about to drop the column `data_conclusão` on the `registro_ordens` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "registro_ordens" DROP COLUMN "data_conclusão",
ADD COLUMN     "data_conclusao" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP;
