import { Request, Response } from "../types/file.type";
import prisma from "../lib/prisma";

const getAllPayment = async (req: Request, resp: Response): Promise<void> => {
  try {
    const payment = await prisma.payment.findMany();

    if (!payment || payment.length === 0) {
      resp.status(404).json({
        message: "Payment not Found",
      });
      return;
    }

    resp.status(200).json({
      data: payment,
      message: "Payments fetched successfully",
    });
    return;
  } catch (error) {
    resp.status(500).json({ error });
    return;
  }
};

const createPayment = async (req: Request, resp: Response): Promise<void> => {
  try {
    const { userId, subscriptionId, amount, date, method } = req.body;

    if (!userId || !subscriptionId || !amount || !date || !method) {
      resp.status(400).json({
        message: "All fields are required",
      });
      return;
    }

    const data = await prisma.payment.create({
      data: {
        userId,
        subscriptionId,
        amount,
        date,
        method,
      },
    });

    resp.status(201).json({
      success: true,
      result: data,
      message: "Payment Information Saved Successfully",
    });
    return;
  } catch (error) {
    resp.status(500).json({
      error,
      message: "Error Saving Information",
    });
    return;
  }
};

const getPaymentById = async (req: Request, resp: Response): Promise<void> => {
  try {
    const paymentId = req.params.id;

    const data = await prisma.payment.findUnique({
      where: {
        id: paymentId,
      },
    });

    if (!data) {
      resp.status(404).json({
        message: "Payment not found",
      });
      return;
    }

    resp.status(200).json({
      data,
      message: "Payment Information Successfully Found",
    });
    return;
  } catch (error) {
    resp.status(500).json({
      error,
      message: "Payment Info Not Found",
    });
    return;
  }
};

const updatePaymentById = async (
  req: Request,
  resp: Response,
): Promise<void> => {
  try {
    const paymentId = req.params.id;
    const body = req.body;

    const existingPayment = await prisma.payment.findUnique({
      where: {
        id: paymentId,
      },
    });

    if (!existingPayment) {
      resp.status(404).json({
        message: "Payment Not Found",
      });
      return;
    }

    const updatedData = {
      ...body,
    };

    const payment = await prisma.payment.update({
      where: {
        id: paymentId,
      },
      data: updatedData,
    });

    resp.status(200).json({
      data: payment,
      message: "Payment Info Updated Successfully",
    });
    return;
  } catch (error) {
    resp.status(500).json({
      error,
      message: "Payment Info Not Updated Successfully",
    });
    return;
  }
};

const deletePaymentById = async (
  req: Request,
  resp: Response,
): Promise<void> => {
  try {
    const paymentId = req.params.id;

    const existingPayment = await prisma.payment.findUnique({
      where: {
        id: paymentId,
      },
    });

    if (!existingPayment) {
      resp.status(404).json({
        message: "Payment Not Found",
      });
      return;
    }

    const payment = await prisma.payment.delete({
      where: {
        id: paymentId,
      },
    });

    resp.status(200).json({
      payment,
      message: "Payment deleted successfully",
    });
    return;
  } catch (error) {
    resp.status(500).json({
      error,
      message: "Payment Not Found",
    });
    return;
  }
};

export {
  getAllPayment,
  createPayment,
  getPaymentById,
  updatePaymentById,
  deletePaymentById,
};
