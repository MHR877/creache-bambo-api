import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const staffRouter = express.Router();

// GET all staff
staffRouter.get("/all", async (req, res) => {
  try {
    const staff = await prisma.staff.findMany();
    res.json(staff);
  } catch (error) {
    console.error("Error fetching staff:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

staffRouter.get("/active", async (req, res) => {
  try {
    const staff = await prisma.staff.findMany({
      where: { isArchived: false },
    });
    res.json(staff);
  } catch (error) {
    console.error("Error fetching staff:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

staffRouter.get("/archived", async (req, res) => {
  try {
    const staff = await prisma.staff.findMany({
      where: { isArchived: true },
    });
    res.json(staff);
  } catch (error) {
    console.error("Error fetching staff:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET a single staff member by ID
staffRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const staffMember = await prisma.staff.findUnique({
      where: { id: Number(id) },
    });
    if (staffMember) {
      res.json(staffMember);
    } else {
      res.status(404).json({ error: "Staff member not found" });
    }
  } catch (error) {
    console.error("Error fetching staff member:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST a new staff member
staffRouter.post("/", async (req, res) => {
  const {
    fullName,
    role,
    address,
    workHours,
    workDays,
    emergencyContact,
    phoneNumber,
    email,
    startDate,
    notes,
    photo,
    idCardNumber,
    rib,
  } = req.body;

  try {
    const newStaff = await prisma.staff.create({
      data: {
        fullName,
        role,
        workHours,
        emergencyContact,
        workDays,
        address,
        phoneNumber,
        email,
        startDate: new Date(startDate),
        notes,
        photo,
        idCardNumber,
        rib,
      },
    });
    res.status(201).json(newStaff);
  } catch (error) {
    console.error("Error creating staff member:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// PUT (update) an existing staff member
staffRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    fullName,
    role,
    workHours,
    workDays,
    phoneNumber,
    emergencyContact,
    address,
    email,
    startDate,
    notes,
    photo,
    idCardNumber,
    rib,
  } = req.body;

  try {
    const updatedStaff = await prisma.staff.update({
      where: { id: Number(id) },
      data: {
        fullName,
        emergencyContact,
        role,
        workHours,
        workDays,
        address,
        phoneNumber,
        email,
        startDate: new Date(startDate),
        notes,
        photo,
        idCardNumber,
        rib,
      },
    });
    res.json(updatedStaff);
  } catch (error) {
    console.error("Error updating staff member:", error);
    if (error.code === "P2025") {
      res.status(404).json({ error: "Staff member not found" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});


// DELETE a staff member
staffRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.staff.update({
      where: { id: Number(id) },
      data: {
        isArchived: true,
      },
    });
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting staff member:", error);
    if (error.code === "P2025") {
      res.status(404).json({ error: "Staff member not found" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

export default staffRouter;
