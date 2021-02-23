/* eslint-disable*/
import React, {useState} from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import PeriqlesForm from 'periqles';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import js from 'react-syntax-highlighter/dist/esm/languages/prism/graphql';
import {vscDarkPlus} from 'react-syntax-highlighter/dist/esm/styles/prism';

SyntaxHighlighter.registerLanguage('jsx', jsx);
SyntaxHighlighter.registerLanguage('js', js);

export const USER_DATA = gql`
  fragment UserData on DemoUser {
    username
    password
    email
    gender
    pizzaTopping
    age
  }
`;

export const GET_USER = gql`
  query DemoUser {
    demoUser {
      ...UserData
    }
  }
  ${USER_DATA}
`;

export const ADD_USER = gql`
mutation AddUser($input: AddUserInput!){
  addUser(input: $input){
      username
      email
      gender
      pizzaTopping
      age
    }
}
`;

const ApolloUserProfile = () => {
  const [updated, setUpdate] = useState(false);
  const {
    data,
    loading,
    error,
    refetch
  } = useQuery(GET_USER);
  const [
    addUser,
    respObj
   ] = useMutation(
     ADD_USER,
  );

  const specifications: PeriqlesSpecifications = {
    header: 'Sign Up',
    fields: {
      gender: {
        element: 'radio',
        label: 'Gender',
        options: [
          {label: 'Non-binary', value: 'NON_BINARY'},
          {label: 'Male', value: 'MALE'},
          {label: 'Female', value: 'FEMALE'},
        ],
      },
      pizzaTopping: {
        label: 'Favorite pizza topping:',
        element: 'select',
        options: [
          {label: 'Buffalo chicken', value: 'BUFFALO_CHICKEN'},
          {label: 'Pepperoni', value: 'PEPPERONI'},
          {label: 'Meat lovers', value: 'MEATLOVERS'},
          {label: 'Eggplant parmesan', value: 'EGGPLANT_PARM'},
          {label: 'Olives', value: 'OLIVES'},
          {label: 'Hawaiian', value: 'HAWAIIAN'},
        ],
      },
    },
  };

  const args = {clientMutationId: '0000'};

  const onSuccess = (response) => {
    refetch(GET_USER);
  };

  const onFailure = (error) => {
    alert(`Problem submitting form: ${error.toString()}`);
  };
  
  const renderUser = (demoUser) => {
    return (
      <div>
        <p><label>Username:</label> {demoUser.username}</p>
        <p><label>Email:</label> {demoUser.email}</p>
        <p><label>Gender:</label> {demoUser.gender}</p>
        <p><label>Favorite Pizza Topping:</label> {demoUser.pizzaTopping}</p>
        <p><label>Age:</label> {demoUser.age}</p>
      </div>
    )
  }
 
    return (
      <div>
      <section className="UserProfile">
          <PeriqlesForm
            mutationName={'AddUser'}
            callbacks={{onSuccess, onFailure}}
            specifications={specifications}
            args={args}
            useMutation={addUser}
          />
          <main className="UserProfile-main">
              <h2>Most Recently Added User</h2>
              {loading ? <p>Loading data...</p> : null}
              {error ? <p>ERROR: {JSON.stringify(error)}</p> : null}
              {data && data.demoUser ? renderUser(data.demoUser): <p>Sign up...</p>}
          </main>
        </section>
        <section className="CodeDemo">
        <h1>Apollo Code Examples</h1>
        <section className="Codeblocks">
          <section className="SchemaCode">
            <h3>Mutation Schema</h3>
            <SyntaxHighlighter language="js" style={vscDarkPlus} showLineNumbers={true} codeTagProps={{style: {fontSize: "inherit"}}} customStyle={{fontSize: 18}}>
              {"mutation AddUser($input: AddUserInput!){\n"+
              "  addUser(input: $input) {\n"+
              "    username\n"+
              "    password\n"+
              "    email\n"+
              "    gender\n"+
              "    pizzaTopping\n"+
              "    age\n"+
              "  }\n"+
              "}"}
            </SyntaxHighlighter>
          </section>
          <section className="PeriqlesCode">
            <h3>PeriqlesForm Tag</h3>
            <SyntaxHighlighter language="jsx" style={vscDarkPlus} showLineNumbers={true} codeTagProps={{style: {fontSize: "inherit"}}} customStyle={{fontSize: 18}}>
              {"<PeriqlesForm\n"+
              "  mutationName={'AddUser'}\n"+
              "  callbacks={{onSuccess, onFailure}}\n"+
              "  specifications={specifications}\n"+
              "  args={args}\n"+
              "  useMutation={addUser}\n"+
            "/>\n"+
            "\n"+
            "\n"}
            </SyntaxHighlighter>
          </section>
        </section>
    </section>
    </div>
    );
};

export default ApolloUserProfile;
