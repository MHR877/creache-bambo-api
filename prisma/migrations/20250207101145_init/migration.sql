/*
  Warnings:

  - You are about to drop the column `isPaid` on the `Child` table. All the data in the column will be lost.
  - You are about to drop the column `lastPaymentDate` on the `Child` table. All the data in the column will be lost.
  - You are about to drop the column `parentName` on the `Child` table. All the data in the column will be lost.
  - You are about to drop the column `paymentEndDate` on the `Child` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Child` table. All the data in the column will be lost.
  - Added the required column `fatherFamilyName` to the `Child` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fatherName` to the `Child` table without a default value. This is not possible if the table is not empty.
  - Added the required column `guardianContact` to the `Child` table without a default value. This is not possible if the table is not empty.
  - Added the required column `motherFamilyName` to the `Child` table without a default value. This is not possible if the table is not empty.
  - Added the required column `motherName` to the `Child` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address` to the `Staff` table without a default value. This is not possible if the table is not empty.
  - Added the required column `emergencyContact` to the `Staff` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idCardNumber` to the `Staff` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rib` to the `Staff` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "StaffSalary" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "staffId" INTEGER NOT NULL,
    "amount" REAL NOT NULL,
    "bonus" REAL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "StaffSalary_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "amount" REAL NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paymentType" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "startDate" DATETIME,
    "endDate" DATETIME,
    "childId" INTEGER,
    "staffId" INTEGER,
    CONSTRAINT "Payment_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Payment_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Expense" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "description" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "category" TEXT NOT NULL,
    "paidTo" TEXT NOT NULL,
    "notes" TEXT
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Child" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fullName" TEXT NOT NULL,
    "fatherName" TEXT NOT NULL,
    "motherName" TEXT NOT NULL,
    "motherFamilyName" TEXT NOT NULL,
    "fatherFamilyName" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "birthDate" DATETIME NOT NULL,
    "address" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "notes" TEXT,
    "photo" TEXT NOT NULL,
    "registrationDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "medicalInfo" TEXT,
    "guardianContact" TEXT NOT NULL,
    "isArchived" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Child" ("address", "birthDate", "fullName", "gender", "id", "nationality", "notes", "phoneNumber", "photo") SELECT "address", "birthDate", "fullName", "gender", "id", "nationality", "notes", "phoneNumber", "photo" FROM "Child";
DROP TABLE "Child";
ALTER TABLE "new_Child" RENAME TO "Child";
CREATE TABLE "new_Staff" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fullName" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "workHours" TEXT NOT NULL,
    "workDays" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "emergencyContact" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "notes" TEXT,
    "photo" TEXT NOT NULL,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "idCardNumber" TEXT NOT NULL,
    "rib" TEXT NOT NULL
);
INSERT INTO "new_Staff" ("email", "fullName", "id", "notes", "phoneNumber", "photo", "role", "startDate", "workDays", "workHours") SELECT "email", "fullName", "id", "notes", "phoneNumber", "photo", "role", "startDate", "workDays", "workHours" FROM "Staff";
DROP TABLE "Staff";
ALTER TABLE "new_Staff" RENAME TO "Staff";
CREATE UNIQUE INDEX "Staff_idCardNumber_key" ON "Staff"("idCardNumber");
CREATE UNIQUE INDEX "Staff_rib_key" ON "Staff"("rib");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Payment_childId_key" ON "Payment"("childId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_staffId_key" ON "Payment"("staffId");
