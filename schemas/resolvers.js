import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { GraphQLError } from "graphql";
import jwt from "jsonwebtoken";
import { authError } from "../authError.js";

const jwtSecret = "SECRET";

export const resolvers = {
  Query: {
    posts: async (_, args, context) => {
      if (context && context.user) {
        return await prisma.post.findMany();
      }

      authError();
    },

    getPostsByUser: async (_, args, context) => {
      if (context && context.user) {
        return await prisma.post.findMany({
          where: {
            authorId: context.user.id,
          },
        });
      }

      authError();
    },

    post: async (_, { id }) => {
      return await prisma.post.findUnique({
        where: {
          id,
        },
      });
    },
  },

  Mutation: {
    createPost: async (_, { title, content }, context) => {
      if (context && context.user) {
        return await prisma.post.create({
          data: {
            title,
            content,
            authorId: context.user.id,
          },
        });
      }

      authError();
    },

    registerUser: async (_, { registerUser: { email, password } }) => {
      const user = await prisma.user.findUnique({
        where: { email: email },
      });

      if (user) {
        throw new GraphQLError("User already exist");
      }

      const hashPassword = await bcrypt.hash(password, 10);
      const token = jwt.sign({ user: email }, jwtSecret, { expiresIn: "1d" });

      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashPassword,
          token,
        },
      });

      return newUser;
    },

    loginUser: async (_, { loginUser: { email, password } }) => {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (user) {
        const validPass = await bcrypt.compare(password, user.password);

        if (validPass) {
          const token = jwt.sign({ user: user.email }, jwtSecret, {
            expiresIn: "1d",
          });

          const updateUser = await prisma.user.update({
            where: { email },
            data: {
              token,
            },
          });

          return updateUser;
        }

        throw new GraphQLError("Wrong password");
      }

      throw new GraphQLError("User not found");
    },

    updatePost: async (_, { id, title, content }, context) => {
      if (context && context.user) {
        const post = await prisma.post.findUnique({
          where: {
            id,
            authorId: context.user.id,
          },
        });

        if (post) {
          return await prisma.post.update({
            where: {
              id: post.id,
            },
            data: {
              title,
              content,
            },
          });
        }
        throw new GraphQLError("Post not belongs to you");
      }
    },

    deletePost: async (_, { id }) => {
      return await prisma.post.delete({
        where: {
          id,
        },
      });
    },

    deletePostByUser: async (_, { id }, context) => {
      if (context && context.user) {
        const post = await prisma.post.findUnique({
          where: {
            id,
            authorId: context.user.id,
          },
        });

        if (post) {
          return await prisma.post.delete({
            where: {
              id: post.id,
            },
          });
        }
        throw new GraphQLError("Post not belongs to you");
      }
    },
  },
};
