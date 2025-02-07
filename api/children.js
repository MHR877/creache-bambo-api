import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const childrenRouter = express.Router();

// GET all children (both archived and not archived)
childrenRouter.get("/all", async (req, res) => {
  try {
    const children = await prisma.child.findMany();
    res.json(children);
  } catch (error) {
    console.error("Error fetching children:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET non-archived children
childrenRouter.get("/active", async (req, res) => {
  try {
    const children = await prisma.child.findMany({
      where: { isArchived: false },
    });
    res.json(children);
  } catch (error) {
    console.error("Error fetching active children:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET archived children
childrenRouter.get("/archived", async (req, res) => {
  try {
    const children = await prisma.child.findMany({
      where: { isArchived: true },
    });
    res.json(children);
  } catch (error) {
    console.error("Error fetching archived children:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET a single child by ID
childrenRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const child = await prisma.child.findUnique({
      where: { id: Number(id) },
    });
    if (child) {
      res.json(child);
    } else {
      res.status(404).json({ error: "Child not found" });
    }
  } catch (error) {
    console.error("Error fetching child:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST a new child
childrenRouter.post("/", async (req, res) => {
  const {
    fullName,
    fatherName,
    motherName,
    motherFamilyName,
    fatherFamilyName,
    gender,
    phoneNumber,
    birthDate,
    address,
    nationality,
    notes,
    photo,
    medicalInfo,
    guardianContact,
  } = req.body;

  try {
    const newChild = await prisma.child.create({
      data: {
        fullName,
        fatherName,
        motherName,
        motherFamilyName,
        fatherFamilyName,
        gender,
        phoneNumber,
        birthDate: new Date(birthDate),
        address,
        nationality,
        notes,
        photo,
        medicalInfo,
        guardianContact,
      },
    });
    res.status(201).json(newChild);
  } catch (error) {
    console.error("Error creating child:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT (update) an existing child
childrenRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    fullName,
    fatherName,
    motherName,
    motherFamilyName,
    fatherFamilyName,
    gender,
    phoneNumber,
    birthDate,
    address,
    nationality,
    notes,
    photo,
    medicalInfo,
    guardianContact,
    isArchived,
  } = req.body;

  try {
    const updatedChild = await prisma.child.update({
      where: { id: Number(id) },
      data: {
        fullName,
        fatherName,
        motherName,
        motherFamilyName,
        fatherFamilyName,
        gender,
        phoneNumber,
        birthDate: new Date(birthDate),
        address,
        nationality,
        notes,
        photo,
        medicalInfo,
        guardianContact,
        isArchived,
      },
    });
    res.json(updatedChild);
  } catch (error) {
    console.error("Error updating child:", error);
    if (error.code === "P2025") {
      res.status(404).json({ error: "Child not found" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

// DELETE a child
childrenRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.child.update({
      where: { id: Number(id) },
      data: {
        isArchived: true,
      },
    });
    res.status(201).send();
  } catch (error) {
    console.error("Error deleting child:", error);
    if (error.code === "P2025") {
      res.status(404).json({ error: "Child not found" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

export default childrenRouter;
