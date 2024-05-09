import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { FullConversationType } from "../types";
import { User } from "@prisma/client";

const useOtherUser = (
  conversation:
    | FullConversationType
    | {
        user: User[];
      }
) => {
  const session = useSession();

  const otherUser = useMemo(() => {
    const currentUserEmail = session?.data?.user?.email;

    const otherUsers = conversation.user.filter(
      (user) => user.email !== currentUserEmail
    );

    return otherUsers[0];
  }, [session?.data?.user?.email, conversation.user]);

  return otherUser;
};

export default useOtherUser;
