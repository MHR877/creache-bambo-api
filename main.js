import express from "express";
import multer from "multer";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const appExpress = express();
appExpress.use(express.json());
appExpress.use(cors());
appExpress.use("/images", express.static(path.join(__dirname, "images")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "images")); // Save files in the "images" directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`); // Create a unique filename
  },
});

const upload = multer({ storage });

appExpress.post("/upload", upload.single("image"), (req, res) => {
  if (req.file) {
    res.json({
      message: "Upload successful",
      filename: req.file.filename,
      filepath: `/images/${req.file.filename}`, // Optional: Return the file path
    });
  } else {
    res.status(400).json({ message: "Upload failed" });
  }
});

import childrenRouter from "./api/children.js";
import staffRouter from "./api/staff.js";
import expenseRouter from "./api/expense.js";
import paymentRouter from "./api/payment.js";
import staffExpenseRouter from "./api/staffSalary.js";

appExpress.use("/children", childrenRouter);
appExpress.use("/staff", staffRouter);
appExpress.use("/expense", expenseRouter);

appExpress.use("/payment", paymentRouter);
appExpress.use("/staff-salary", staffExpenseRouter);

appExpress.post("/request", async (req, res) => {
  const { name, familyName, gender, parentName, phoneNumber, birthDate } =
    req.body;

  try {
    // Step 1: Create the request record (optional, depends on your use case)
    const newRequest = await prisma.request.create({
      data: {
        name,
        familyName,
        gender,
        parentName,
        phoneNumber,
        birthDate: new Date(birthDate),
      },
    });

    // Step 2: Push the data to the `Child` model
    const newChild = await prisma.child.create({
      data: {
        fullName: `${name} ${familyName}`,
        gender,
        parentName,
        phoneNumber,
        birthDate: new Date(birthDate),
        address: "", // Default empty address, you can modify as per your requirements
        nationality: "", // Default empty nationality, you can modify as per your requirements
        notes: "", // Default empty notes, you can modify as per your requirements
        photo: "", // Default empty photo, you can modify as per your requirements
      },
    });

    // Step 3: Respond with the new child record (or any other relevant information)
    res.status(201).json({ newChild, newRequest });
  } catch (error) {
    console.error("Error creating request or child:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
appExpress.listen(8800, () => {
  console.log("Express server listening on port 8800!");
});
