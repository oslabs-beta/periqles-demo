const {demoGraphQLUser} = require('../nodes.js');
const {
  DemoUser,
  getLastDemoUserOrThrow,
  getAllUsers,
} = require('../../database.js');

const demoUserQuery = {
  type: demoGraphQLUser,
  resolve: (root) => {

    getAllUsers();
    return getLastDemoUserOrThrow();
  },
};

module.exports = {demoUserQuery};
