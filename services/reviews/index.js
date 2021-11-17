const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");

const typeDefs = gql`
  type Review @key(fields: "id") {
    id: ID!
    body: String
    author: User
  }

  extend interface User @key(fields: "id") {
    id: ID! @external
    reviews: [Review]
  }

  extend type Admin implements User @key(fields: "id") {
    id: ID! @external
    reviews: [Review]
  }

  extend type Dev implements User @key(fields: "id") {
    id: ID! @external
    reviews: [Review]
  }
`;

const resolvers = {
  Review: {
    author(review) {
      return {
        /**
         * Having to resolve the type in this service is the big problem with this, it doesn't work otherwise
         * vvv
         * "Abstract type \"User\" must resolve to an Object type at runtime for field \"Review.author\". Either the \"User\" type should provide a \"resolveType\" function or each possible type should provide an \"isTypeOf\" function."
         */
        __typename: review.authorType,
        id: review.authorID,
      };
    },
  },
  Admin: {
    reviews(user) {
      return reviews.filter((review) => review.authorID === user.id);
    },
  },
  Dev: {
    reviews(user) {
      return reviews.filter((review) => review.authorID === user.id);
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

server.listen({ port: 4002 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

const reviews = [
  {
    id: "1",
    authorID: "1",
    authorType: "Admin",
    body: "Love it!",
  },
  {
    id: "2",
    authorID: "1",
    authorType: "Admin",
    body: "Too expensive.",
  },
  {
    id: "3",
    authorID: "2",
    authorType: "Dev",
    body: "Could be better.",
  },
  {
    id: "4",
    authorID: "2",
    authorType: "Dev",
    body: "Prefer something else.",
  },
];
