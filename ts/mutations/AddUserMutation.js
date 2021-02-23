import {commitMutation, graphql} from 'react-relay';

const mutation = graphql`
  mutation AddUserMutation($input: AddUserInput!) {
    addUser(input: $input) {
      userId
      username
      password
      email
      gender
      pizzaTopping
      age
    }
  }
`;

let tempID = 0;

function commit(
  environment,
  username,
  password,
  email,
  gender,
  pizzaTopping,
  age,
) {
  const input = {
    username,
    password,
    email,
    gender,
    pizzaTopping,
    age,
    clientMutationId: `${tempID++}`,
  };

  return commitMutation(environment, {
    mutation,
    variables: {
      input,
    },
    updater: (store) => {
      const payload = store.getRootField('addUser');
      const newUserId = payload.getValue('userId');
      const newUsername = payload.getValue('username');
      const newPassword = payload.getValue('password');
      const newEmail = payload.getValue('email');
      const newGender = payload.getValue('gender');
      const newPizzaTopping = payload.getValue('pizzaTopping');
      const newAge = payload.getValue('age');
    },
  });
}

export default {commit};
