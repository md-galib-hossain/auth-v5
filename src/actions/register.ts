"use server";

import { RegisterSchema } from "@/schemas";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
export const register = async (values: z.infer<typeof RegisterSchema>) => {
  console.log(values);
  const validatedFields = RegisterSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const { email, password, name } = validatedFields.data;
  const existingUser = await getUserByEmail(email)
  if (existingUser) {
    return { error: "Email already in use" };
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  await db.user.create({
    data: {
      name,
      email,
      password:hashedPassword,
    },
  });
  //TODO: send verification token email
  return { success: "User created!" };
};
