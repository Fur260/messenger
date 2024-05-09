import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "../../../actions/getCurrentUser";
import { pusherServer } from "../../../libs/pusher";

interface IParams {
  conversationId?: string;
}

export const DELETE = async (
  request: Request,
  { params }: { params: IParams }
) => {
  try {
    const { conversationId } = params || {};
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!conversationId) return new NextResponse("Invalid Id", { status: 400 });

    const existingConversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: { user: true },
    });

    if (!existingConversation) {
      return new NextResponse("Invalid Id", { status: 400 });
    }

    const deletedConversations = await prisma.conversation.deleteMany({
      where: {
        id: conversationId,
        userIds: {
          hasSome: [currentUser.id],
        },
      },
    });

    existingConversation.user.forEach((user) => {
      if (user.email) {
        pusherServer.trigger(
          user.email,
          "conversation:remove",
          existingConversation
        );
      }
    });

    return NextResponse.json(deletedConversations);
  } catch (error) {
    console.log("Conversation Delete Error::", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
