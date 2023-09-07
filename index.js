import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const typeDefs = `#graphql

    type Post {
        id: Int!
        title: String!
        content: String!
        createdAt: String!
        updatedAt: String!
    }

    type Query {
        posts: [Post!]!
        post(id: Int!): Post
    }

    type Mutation {
        createPost(title: String!, content: String!): Post!
        updatePost(id: Int!, title: String!, content: String!): Post!
        deletePost(id: Int!): Post
    }
`;

const resolvers = {
  Query: {
    posts: async () => {
      return await prisma.post.findMany();
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
    createPost: async (_, { title, content }) => {
      return await prisma.post.create({
        data: {
          title,
          content,
        },
      });
    },

    updatePost: async (_, { id, title, content }) => {
      return await prisma.post.update({
        where: {
          id,
        },
        data: {
          title,
          content,
        },
      });
    },

    deletePost: async (_, { id }) => {
      return await prisma.post.delete({
        where: {
          id,
        },
      });
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 5000 },
});

console.log(`🚀  Server ready at: ${url}`);
