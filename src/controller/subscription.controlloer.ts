import { Request, Response } from "../types/file.type";
import prisma from "../lib/prisma";

const getAllSubscription = async (
  req: Request,
  resp: Response,
): Promise<void> => {
  try {
    const subscription = await prisma.subscription.findMany();

    if (!subscription || subscription.length === 0) {
      resp.status(404).json({ message: "Subscription not Found" });
      return;
    }

    resp.status(200).json(subscription);
    return;
  } catch (error) {
    resp.status(500).json({ error });
    return;
  }
};

const createSubscription = async (
  req: Request,
  resp: Response,
): Promise<void> => {
  try {
    const { userId, status, plan, startDate, endDate } = req.body;

    if (!status || !plan || !userId || !startDate || !endDate) {
      resp.status(400).json({ message: "All fields are required" });
      return;
    }

    const data = await prisma.subscription.create({
      data: {
        userId,
        status,
        plan,
        startDate,
        endDate,
      },
    });

    resp.status(201).json({
      result: data,
      message: "Subscription Information Saved Successfully",
    });
    return;
  } catch (error) {
    resp.status(500).json({ error, message: "Error Saving Information" });
    return;
  }
};

const getSubscriptionById = async (
  req: Request,
  resp: Response,
): Promise<void> => {
  try {
    const subscriptionId = req.params.id;

    const data = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!data) {
      resp.status(404).json({ message: "Subscription not found" });
      return;
    }

    resp.status(200).json({
      data,
      message: "Subscription Successfully Found",
    });
    return;
  } catch (error) {
    resp.status(500).json({
      error,
      message: "Subscription fetch failed",
    });
    return;
  }
};

const updateSubscriptionById = async (
  req: Request,
  resp: Response,
): Promise<void> => {
  try {
    const subscriptionId = req.params.id;
    const body = req.body;

    const existingSubscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!existingSubscription) {
      resp.status(404).json({ message: "Subscription Not Found" });
      return;
    }

    const subscription = await prisma.subscription.update({
      where: { id: subscriptionId },
      data: { ...body },
    });

    resp.status(200).json({
      data: subscription,
      message: "Subscription Updated Successfully",
    });
    return;
  } catch (error) {
    resp.status(500).json({
      error,
      message: "Subscription update failed",
    });
    return;
  }
};

const deleteSubscriptionById = async (
  req: Request,
  resp: Response,
): Promise<void> => {
  try {
    const subscriptionId = req.params.id;

    const existingSubscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!existingSubscription) {
      resp.status(404).json({ message: "Subscription Not Found" });
      return;
    }

    const subscription = await prisma.subscription.delete({
      where: { id: subscriptionId },
    });

    resp.status(200).json({
      subscription,
      message: "Subscription deleted successfully",
    });
    return;
  } catch (error) {
    resp.status(500).json({
      error,
      message: "Subscription delete failed",
    });
    return;
  }
};

export {
  getAllSubscription,
  createSubscription,
  getSubscriptionById,
  updateSubscriptionById,
  deleteSubscriptionById,
};
