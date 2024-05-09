import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "../../actions/getCurrentUser";

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const { name, image = "" } = body || {};
    const currentUser = await getCurrentUser();

    if (!currentUser?.id)
      return new NextResponse("UnAuthorized", { status: 403 });

    const updatedUser = await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        name,
        image,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.log("Error in Settings POST request:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
