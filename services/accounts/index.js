const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");

const typeDefs = gql`
  extend type Query {
    user(id: String!): User
  }

  interface User @key(fields: "id") {
    id: ID!
    name: String
    username: String
  }

  type Admin implements User @key(fields: "id") {
    id: ID!
    name: String
    username: String
  }

  type Dev implements User @key(fields: "id") {
    id: ID!
    name: String
    username: String
  }
`;

const resolvers = {
  Query: {
    user(_object, { id }) {
      return users.find((user) => user.id === id);
    },
  },
  //I doubt this works
  User: {
    __resolveReference(object) {
      return users.find(user => user.id === object.id);
    }
  },

  User: {
    __resolveType(object, context, info) {
      console.log("User:__resolveType");
      return users.find((user) => user.id === object.id).__typename;
    },
  },
  Admin: {
    __resolveReference(object) {
      console.log("Admin:__resolveReference");
      return users.find((user) => user.id === object.id);
    },
  },
  Dev: {
    __resolveReference(object) {
      console.log("Dev:__resolveReference");
      return users.find((user) => user.id === object.id);
    },
  },
};

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers,
    },
  ]),
});

server.listen({ port: 4001 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

const users = [
  {
    __typename: "Admin",
    id: "1",
    name: "Ada Lovelace",
    birthDate: "1815-12-10",
    username: "@ada",
  },
  {
    __typename: "Dev",
    id: "2",
    name: "Alan Turing",
    birthDate: "1912-06-23",
    username: "@complete",
  },
];
