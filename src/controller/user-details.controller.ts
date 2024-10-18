// import { Request, Response } from "express";
// // import UserDetails from "../models/UserDetails.model";
// import bcrypt from "bcrypt";
// import prisma from "../lib/prisma.config";

// const getAllUserDetails = async (req: Request, resp: Response): Promise<void> => {
//   try {
//     // Check cache first

//     let data = await prisma.UserDetails.findMany();
//     if (data && data.length > 0) {
//       resp.status(200).json({ response: data });
//     } else {
//       resp.status(404).json({ message: "UserDetailss not Found" });
//     }
//   } catch (error) {
//     resp.status(500).json({ error });
//   }
// };

// const createUserDetails = async (req: Request, resp: Response) => {
//   try {
//     const { UserDetailsname, email, password } = req.body;
//     if (!UserDetailsname || !email || !password) {
//       resp.status(404).json({ message: "All fields are required" });
//     }
//     // Saving Encrypted Password;
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const data = await prisma.UserDetails.createMany({
//       data: {
//         UserDetailsname,
//         email,
//         password: hashedPassword,
//       },
//     });

//     resp
//       .status(201)
//       .json({ result: data, message: "UserDetails Information Saved Successfully" });
//   } catch (error) {
//     resp.status(500).json({ error, message: "Error Saving Information" });
//   }
// };

// /// UserDetails By Id.
// const getUserDetailsById = async (req: Request, resp: Response) => {
//   try {
//     const UserDetailsId = req.params.id;

//     let data = await prisma.UserDetails.findUnique({
//       where: {
//         id: UserDetailsId,
//       },
//     });
//     if (!data) {
//       resp.status(404).json({ message: "UserDetails not found" });
//       return;
//     } else {
//       resp
//         .status(200)
//         .json({ data: data, message: "UserDetails Infomation Successfully Found" });
//     }
//   } catch (error) {
//     resp
//       .status(500)
//       .json({ error, message: "UserDetails Info Not Updated Successfully" });
//   }
// };

// const updateUserDetailsById = async (req: Request, resp: Response) => {
//   try {
//     const UserDetailsId = req.params.id;
//     const body = req.body;
//     // const hashedPassword = ;
//     let updatedData = {
//       ...body,
//     };

//     // Check if password exists and is not empty
//     if (body.password) {
//       updatedData.password = await bcrypt.hash(body.password, 10);
//     } else {
//       // Optionally remove password if it is not being updated
//       delete updatedData.password;
//     }

//     // let data = await UserDetails.updateOne({ UserDetailsId }, updateUserDetails);
//     const UserDetails = await prisma.UserDetails.update({
//       where: { id: UserDetailsId },
//       data: updatedData,
//     });
//     resp
//       .status(200)
//       .json({ data: UserDetails, message: "UserDetails Info Updated Successfully" });
//   } catch (error) {
//     console.error(error); // Log the full error object
//     resp
//       .status(500)
//       .json({ error, message: "UserDetails Info Not Updated Successfully" });
//   }
// };

// const deleteUserDetailsById = async (req: Request, resp: Response) => {
//   try {
//     const UserDetailsId = req.params.id;

//     const UserDetails = await prisma.UserDetails.delete({
//       where: { id: UserDetailsId },
//     });
//     if (UserDetails) {
//       // If no UserDetails was deleted, return a 404 Not Found response
//       resp.status(200).json({ UserDetails, message: "UserDetails deleted successfully" });
//     } else {
//       resp.status(404).json({ message: "UserDetails not found" });
//     }
//   } catch (error) {
//     resp.status(500).json({ error, message: "UserDetails Not Found" });
//   }
// };
// export { getAllUserDetails, createUserDetails, getUserDetailsById, updateUserDetailsById, deleteUserDetailsById };
