import { Request, Response } from "../types/file.type";

import prisma from "../lib/prisma.config";
// import { supabase } from "../lib/supabaseClient";

const getAllPayment = async (req: Request, resp: Response) => {
  try {
    let Payment = await prisma.payment.findMany();

    if (!Payment || Payment.length === 0) {
      resp.status(404).json({ message: "Payment not Found" });
    }

    resp.status(200).json(Payment);
  } catch (error) {
    resp.status(500).json({ error });
  }
};

const createPayment = async (req: Request, resp: Response) => {
  try {
    const { userId, subscriptionId, amount, date, method } = req.body;

    if (!userId || !subscriptionId || !amount || !date || !method) {
      resp.status(404).json({ message: "All fields are required" });
    }

    // Upload the image to a specific folder in your Supabase storage bucket
    // const { data: storageData, error: storageError } = await supabase.storage
    //   .from("music-store")
    //   .upload(`Payment/${file.originalname}`, file.buffer, {
    //     cacheControl: "3600",
    //     upsert: false,
    //     contentType: file.mimetype,
    //   });

    // if (storageError) {
    //   return resp
    //     .status(500)
    //     .json({
    //       error: storageError,
    //       message: "Error uploading image to Supabase",
    //     });
    // }

    // Get the public URL for the image
    // const { data: urlData, error: urlError } = supabase.storage
    //   .from("music-store")
    //   .getPublicUrl(`images/${file.originalname}`);

    // if (urlError || !urlData) {
    //   return resp.status(500).json({
    //     error: urlError,
    //     message: "Error generating public URL for the image",
    //   });
    // }

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
      result: data,
      message: "Payment Information Saved Successfully",
    });
  } catch (error) {
    resp.status(500).json({ error, message: "Error Saving Information" });
  }
};

/// Payment By Id.
const getPaymentById = async (req: Request, resp: Response) => {
  try {
    const PaymentId = req.params.id;

    let data = await prisma.payment.findUnique({
      where: {
        id: PaymentId,
      },
    });
    if (!data) {
      resp.status(404).json({ message: "Payment not found" });
    } else {
      resp
        .status(200)
        .json({ data: data, message: "Payment Infomation Successfully Found" });
    }
  } catch (error) {
    resp
      .status(500)
      .json({ error, message: "Payment Info Not Updated Successfully" });
  }
};

const updatePaymentById = async (req: Request, resp: Response) => {
  try {
    const PaymentId = req.params.id;
    const body = req.body;

    const existingPayment = await prisma.payment.findUnique({
      where: {
        id: PaymentId,
      },
    });

    if (!existingPayment) {
      resp.status(404).json({ message: "Payment Not Found" });
    }

    let updatedData = {
      ...body,
    };

    // let data = await Payment.updateOne({ PaymentId }, updatePayment);
    const Payment = await prisma.payment.update({
      where: { id: PaymentId },
      data: updatedData,
    });
    resp
      .status(200)
      .json({ data: Payment, message: "Payment Info Updated Successfully" });
  } catch (error) {
    resp
      .status(500)
      .json({ error, message: "Payment Info Not Updated Successfully" });
  }
};

const deletePaymentById = async (req: Request, resp: Response) => {
  try {
    const PaymentId = req.params.id;

    const existingPayment = await prisma.payment.findUnique({
      where: {
        id: PaymentId,
      },
    });

    if (!existingPayment) {
      resp.status(404).json({ message: "Payment Not Found" });
    }

    const Payment = await prisma.payment.delete({
      where: { id: PaymentId },
    });
    resp.status(200).json({ Payment, message: "Payment deleted successfully" });
  } catch (error) {
    resp.status(500).json({ error, message: "Payment Not Found" });
  }
};
export {
  getAllPayment,
  createPayment,
  getPaymentById,
  updatePaymentById,
  deletePaymentById,
};
