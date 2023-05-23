const { User, Post } = require("../models");

const resolvers = {
  Query: {
    users: async () => {
      return User.find({});
    },
    user: async (parent, { id }) => {
      return User.findById(id);
    },
    posts: async () => {
      return Post.find({});
    },
    post: async (parent, { id }) => {
      return Post.findById(id);
    },
  },
  Mutation: {
    addUser: async (parent, { username, email }) => {
      return User.create({ username, email });
    },
    addPost: async (parent, { title, content }, context) => {
      if (context.user) {
        return Post.create({ title, content, author: context.user._id });
      }
      throw new Error("You need to be logged in to post!");
    },
  },
};

module.exports = resolvers;
