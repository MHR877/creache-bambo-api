import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const salaryRouter = express.Router();

// GET all salaries
salaryRouter.get("/", async (req, res) => {
  try {
    const salaries = await prisma.staffSalary.findMany();
    res.json(salaries);
  } catch (error) {
    console.error("Error fetching salaries:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET a single salary by ID
salaryRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const salary = await prisma.staffSalary.findUnique({
      where: { id: Number(id) },
    });
    if (salary) {
      res.json(salary);
    } else {
      res.status(404).json({ error: "Salary record not found" });
    }
  } catch (error) {
    console.error("Error fetching salary:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

salaryRouter.get("/staff/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const salary = await prisma.staffSalary.findFirst({
      where: { staffId: Number(id) },
    });
    if (salary) {
      res.json(salary);
    } else {
      res.status(404).json({ error: "Salary record not found" });
    }
  } catch (error) {
    console.error("Error fetching salary:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST a new salary record
salaryRouter.post("/", async (req, res) => {
  const { staffId, amount, bonus, date } = req.body;

  try {
    const newSalary = await prisma.staffSalary.create({
      data: {
        staffId: +staffId,
        amount: +amount,
        bonus: +bonus,
        date: new Date(date),
      },
    });
    res.status(201).json(newSalary);
  } catch (error) {
    console.error("Error creating salary record:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT (update) an existing salary record
salaryRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { staffId, amount, bonus, date } = req.body;

  try {
    const updatedSalary = await prisma.staffSalary.update({
      where: { id: Number(id) },
      data: {
        staffId: +staffId,
        amount: +amount,
        bonus: +bonus,
        date: new Date(date),
      },
    });
    res.json(updatedSalary);
  } catch (error) {
    console.error("Error updating salary record:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE a salary record
salaryRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.staffSalary.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting salary record:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default salaryRouter;
