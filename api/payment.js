import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const paymentRouter = express.Router();

// GET all payments
paymentRouter.get("/", async (req, res) => {
  try {
    const payments = await prisma.payment.findMany();
    res.json(payments);
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET a single payment by ID
paymentRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const payment = await prisma.payment.findUnique({
      where: { id: Number(id) },
    });
    if (payment) {
      res.json(payment);
    } else {
      res.status(404).json({ error: "Payment not found" });
    }
  } catch (error) {
    console.error("Error fetching payment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST a new payment
paymentRouter.post("/", async (req, res) => {
  const { amount, paymentType, status, startDate, endDate, childId, staffId } =
    req.body;

  try {
    const newPayment = await prisma.payment.create({
      data: {
        amount: +amount,
        paymentType,
        status,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        childId: +childId,
        staffId: +staffId,
      },
    });
    res.status(201).json(newPayment);
  } catch (error) {
    console.error("Error creating payment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT (update) an existing payment
paymentRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { amount, paymentType, status, startDate, endDate, childId, staffId } =
    req.body;

  try {
    const updatedPayment = await prisma.payment.update({
      where: { id: Number(id) },
      data: {
        amount: +amount,
        paymentType,
        status,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        childId: +childId,
        staffId: +staffId,
      },
    });
    res.json(updatedPayment);
  } catch (error) {
    console.error("Error updating payment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// In your payment router file
// In your payment router file
paymentRouter.get("/child/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const payments = await prisma.payment.findMany({
        where: { childId: Number(id) },
        orderBy: { date: "desc" },
      });
      
      res.json(payments); // Always return an array (empty if no payments)
    } catch (error) {
      console.error("Error fetching payments:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

// GET all payments for a specific child
paymentRouter.get("/latest/staff/:staffId", async (req, res) => {
  const { staffId } = req.params;
  try {
    const payments = await prisma.payment.findMany({
      where: { staffId: Number(staffId) },
      orderBy: { date: "desc" },
    });
    res.json(payments);
  } catch (error) {
    console.error("Error fetching staff payments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE a payment
paymentRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.payment.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting payment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default paymentRouter;
