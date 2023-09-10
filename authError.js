import { GraphQLError } from "graphql";

export const authError = () => {
  throw new GraphQLError("User is not authenticated", {
    extensions: {
      code: "UNAUTHENTICATED",
    },
  });
};
