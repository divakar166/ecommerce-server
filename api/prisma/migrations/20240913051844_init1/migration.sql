/*
  Warnings:

  - You are about to drop the column `cartid` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `_SellerProducts` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `Cart` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Cart" DROP CONSTRAINT "Cart_buyerId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_cartid_fkey";

-- DropForeignKey
ALTER TABLE "_SellerProducts" DROP CONSTRAINT "_SellerProducts_A_fkey";

-- DropForeignKey
ALTER TABLE "_SellerProducts" DROP CONSTRAINT "_SellerProducts_B_fkey";

-- AlterTable
ALTER TABLE "Cart" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "cartid";

-- DropTable
DROP TABLE "_SellerProducts";

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
