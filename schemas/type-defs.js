export const typeDefs = `#graphql

    type Post {
        id: Int!
        title: String!
        content: String!
        createdAt: String!
        updatedAt: String!
        authorId: Int!
    }

    type User {
        id: Int!
        email: String!
        password: String!
        token: String
        posts: [Post!]
    }

    input registerUser {
        email: String!
        password: String!
    }

    input loginUser {
        email: String!
        password: String!
    }

    type Query {
        posts: [Post!]!
        post(id: Int!): Post
        getPostsByUser: [Post!]
    }

    type Mutation {
        createPost(title: String!, content: String!): Post!
        registerUser(registerUser: registerUser!): User
        loginUser(loginUser: loginUser!): User
        updatePost(id: Int!, title: String!, content: String!): Post!
        deletePost(id: Int!): Post
        deletePostByUser(id: Int!): Post
    }
`;
