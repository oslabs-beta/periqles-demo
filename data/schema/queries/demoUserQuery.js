// import {GraphQLString} from 'graphql';
const {demoGraphQLUser} = require('../nodes.js');
const {
  DemoUser,
  getLastDemoUserOrThrow,
  getAllUsers,
} = require('../../database.js');

const demoUserQuery = {
  type: demoGraphQLUser,
  // args: {
  //   demoUserId: {type: GraphQLString},
  // },
  resolve: (root) => {

    getAllUsers();
    return getLastDemoUserOrThrow();
  },
};

module.exports = {demoUserQuery};
