/*
  Warnings:

  - Added the required column `photo` to the `Staff` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Staff" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fullName" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "workHours" TEXT NOT NULL,
    "workDays" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "notes" TEXT,
    "photo" TEXT NOT NULL
);
INSERT INTO "new_Staff" ("email", "fullName", "id", "notes", "phoneNumber", "role", "startDate", "workDays", "workHours") SELECT "email", "fullName", "id", "notes", "phoneNumber", "role", "startDate", "workDays", "workHours" FROM "Staff";
DROP TABLE "Staff";
ALTER TABLE "new_Staff" RENAME TO "Staff";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
