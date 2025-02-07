import express from "express"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const childrenRouter = express.Router() 

// GET all children
childrenRouter.get("/", async (req, res) => {
  try {
    const children = await prisma.child.findMany()
    res.json(children)
  } catch (error) {
    console.error("Error fetching children:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// GET a single child by ID
childrenRouter.get("/:id", async (req, res) => {
  const { id } = req.params
  try {
    const child = await prisma.child.findUnique({
      where: { id: Number(id) },
    })
    if (child) {
      res.json(child)
    } else {
      res.status(404).json({ error: "Child not found" })
    }
  } catch (error) {
    console.error("Error fetching child:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// POST a new child
childrenRouter.post("/", async (req, res) => {
  const { fullName, gender, parentName, phoneNumber, birthDate, address, nationality, notes, photo, isPaid, lastPaymentDate, paymentEndDate, price} = req.body;

  try {
    const newChild = await prisma.child.create({
      data: {
        fullName,
        gender,
        parentName,
        phoneNumber,
        birthDate: new Date(birthDate),
        address,
        nationality,
        notes,
        photo,
        isPaid,
        price,
        lastPaymentDate: lastPaymentDate ? new Date(lastPaymentDate) : null,
        paymentEndDate: paymentEndDate ? new Date(paymentEndDate) : null,
      },
    })
    res.status(201).json(newChild)
  } catch (error) {
    console.error("Error creating child:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// PUT (update) an existing child
childrenRouter.put("/:id", async (req, res) => {
  const { id } = req.params
  const { fullName, gender, parentName, phoneNumber, birthDate, address, nationality, notes, photo, isPaid, lastPaymentDate, paymentEndDate, price } = req.body
  try {
    const updatedChild = await prisma.child.update({
      where: { id: Number(id) },
      data: {
        fullName,
        gender,
        parentName,
        phoneNumber,
        birthDate: new Date(birthDate),
        address,
        nationality,
        notes,
        photo,
        isPaid,
        price,
        lastPaymentDate: lastPaymentDate ? new Date(lastPaymentDate) : null,
        paymentEndDate: paymentEndDate ? new Date(paymentEndDate) : null,
      },
    })
    res.json(updatedChild)
  } catch (error) {
    console.error("Error updating child:", error)
    if (error.code === "P2025") {
      res.status(404).json({ error: "Child not found" })
    } else {
      res.status(500).json({ error: "Internal server error" })
    }
  }
})

// New route to update payment status
childrenRouter.patch("/:id/payment", async (req, res) => {
  const { id } = req.params
  const { isPaid, lastPaymentDate, paymentEndDate } = req.body
  try {
    const updatedChild = await prisma.child.update({
      where: { id: Number(id) },
      data: {
        isPaid,
        lastPaymentDate: lastPaymentDate ? new Date(lastPaymentDate) : null,
        paymentEndDate: paymentEndDate ? new Date(paymentEndDate) : null,
      },
    })
    res.json(updatedChild)
  } catch (error) {
    console.error("Error updating payment status:", error)
    if (error.code === "P2025") {
      res.status(404).json({ error: "Child not found" })
    } else {
      res.status(500).json({ error: "Internal server error" })
    }
  }
})

// New route to check and update payment status
childrenRouter.post("/check-payment-status", async (req, res) => {
  try {
    const currentDate = new Date();
    const expiredPayments = await prisma.child.findMany({
      where: {
        isPaid: true,
        paymentEndDate: {
          lt: currentDate
        }
      }
    });

    for (const child of expiredPayments) {
      await prisma.child.update({
        where: { id: child.id },
        data: { isPaid: false }
      });
    }

    res.json({ message: `Updated ${expiredPayments.length} expired payments` });
  } catch (error) {
    console.error("Error checking payment status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE a child
childrenRouter.delete("/:id", async (req, res) => {
  const { id } = req.params
  try {
    await prisma.child.delete({
      where: { id: Number(id) },
    })
    res.status(204).send()
  } catch (error) {
    console.error("Error deleting child:", error)
    if (error.code === "P2025") {
      res.status(404).json({ error: "Child not found" })
    } else {
      res.status(500).json({ error: "Internal server error" })
    }
  }
})

export default childrenRouter

