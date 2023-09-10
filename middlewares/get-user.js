import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { GraphQLError } from "graphql";

const prisma = new PrismaClient();
const JWT_SECRET = "SECRET";

export async function getUser(token) {
  if (!token) {
    throw new GraphQLError("Token is required");
  }
  try {
    const decodedToken = jwt.verify(token, JWT_SECRET);

    if (decodedToken) {
      const user = await prisma.user.findUnique({
        where: {
          email: decodedToken.user,
        },
      });
      return user;
    }
  } catch (error) {
    return null;
  }
}
