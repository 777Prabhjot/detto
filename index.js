import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import express from "express";
import { resolvers } from "./schemas/resolvers.js";
import { typeDefs } from "./schemas/type-defs.js";
import { GraphQLError } from "graphql";
import { getUser } from "./middlewares/get-user.js";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 5000 },
  context: async ({ req, res }) => {
    const token = req.headers.authorization || "";

    const user = await getUser(token);
    if (user) {
      return { user };
    }
  },
});

console.log(`🚀  Server ready at: ${url}`);
