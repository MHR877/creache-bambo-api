-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Child" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fullName" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "parentName" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "birthDate" DATETIME NOT NULL,
    "address" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "notes" TEXT,
    "photo" TEXT NOT NULL,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "lastPaymentDate" DATETIME
);
INSERT INTO "new_Child" ("address", "birthDate", "fullName", "gender", "id", "nationality", "notes", "parentName", "phoneNumber", "photo") SELECT "address", "birthDate", "fullName", "gender", "id", "nationality", "notes", "parentName", "phoneNumber", "photo" FROM "Child";
DROP TABLE "Child";
ALTER TABLE "new_Child" RENAME TO "Child";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
