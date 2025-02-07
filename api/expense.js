import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const expenseRouter = express.Router();

// GET all expenses
expenseRouter.get("/", async (req, res) => {
  try {
    const { search, startDate, endDate, minAmount, maxAmount, category } =
      req.query;

    let whereClause = {};

    if (search) {
      whereClause.OR = [
        { description: { contains: search, mode: "insensitive" } },
        { paidTo: { contains: search, mode: "insensitive" } },
        { notes: { contains: search, mode: "insensitive" } },
      ];
    }

    if (startDate && endDate) {
      whereClause.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    if (minAmount || maxAmount) {
      whereClause.amount = {};
      if (minAmount) whereClause.amount.gte = parseFloat(minAmount);
      if (maxAmount) whereClause.amount.lte = parseFloat(maxAmount);
    }

    if (category) {
      whereClause.category = category;
    }

    const expenses = await prisma.expense.findMany({
      where: whereClause,
      orderBy: { date: "desc" },
    });

    res.json(expenses);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET a single expense by ID
expenseRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const expense = await prisma.expense.findUnique({
      where: { id: Number(id) },
    });
    if (expense) {
      res.json(expense);
    } else {
      res.status(404).json({ error: "Expense not found" });
    }
  } catch (error) {
    console.error("Error fetching expense:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST a new expense
expenseRouter.post("/", async (req, res) => {
  const { description, amount, date, category, paidTo, notes } = req.body;

  try {
    const newExpense = await prisma.expense.create({
      data: {
        description,
        amount: +amount,
        date: new Date(date),
        category,
        paidTo,
        notes,
      },
    });
    res.status(201).json(newExpense);
  } catch (error) {
    console.error("Error creating expense:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT (update) an existing expense
expenseRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { description, amount, date, category, paidTo, notes } = req.body;

  try {
    const updatedExpense = await prisma.expense.update({
      where: { id: Number(id) },
      data: {
        description,
        amount: +amount,
        date: new Date(date),
        category,
        paidTo,
        notes,
      },
    });
    res.json(updatedExpense);
  } catch (error) {
    console.error("Error updating expense:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE an expense
expenseRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.expense.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting expense:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default expenseRouter;
