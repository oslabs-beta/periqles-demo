import React from 'react';
import { gql, useMutation } from '@apollo/client';
import PeriqlesForm from 'periqles';

const Signup = () => {
  const ADD_USER = gql`
    mutation AddUser($input: AddUserInput!){
      addUser(input: $input){
          username
          password
          email
          gender
          pizzaTopping
          age
        }
    }`;

  const [addUser, response] = useMutation(ADD_USER);

  return (<div>
     <h1>Sign Up</h1>
     <PeriqlesForm
      mutationName={'AddUser'}
      useMutation={addUser}
     />
  </div>);
};






