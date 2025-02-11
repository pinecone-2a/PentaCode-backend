-- DropIndex
DROP INDEX "Donation_donorId_key";

-- DropIndex
DROP INDEX "Donation_recipientId_key";

-- AlterTable
ALTER TABLE "BankCard" ALTER COLUMN "expiryDate" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "Otp" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "otp" TEXT NOT NULL,

    CONSTRAINT "Otp_pkey" PRIMARY KEY ("id")
);
