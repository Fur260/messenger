import bcrypt from "bcrypt";
import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const { email, name, password } = body;

    if (!email || !name || !password)
      return new NextResponse("Missing info", { status: 400 });

    const hashedPassword = await bcrypt.hash(password, 12);

    const alreadyExists = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (alreadyExists) {
      return new NextResponse("Email already Exists!", { status: 409 });
    }

    const user = await prisma.user.create({
      data: {
        email,
        name,
        hashedPassword,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.log("Register Error!", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
