import React, {useState} from 'react';
import {QueryRenderer, graphql} from 'react-relay';
import {Environment, Network, RecordSource, Store} from 'relay-runtime';
// import PeriqlesForm from 'periqles';
import PeriqlesForm from '../src/PeriqlesForm';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import js from 'react-syntax-highlighter/dist/esm/languages/prism/graphql';
import {vscDarkPlus} from 'react-syntax-highlighter/dist/esm/styles/prism';

SyntaxHighlighter.registerLanguage('jsx', jsx);
SyntaxHighlighter.registerLanguage('js', js);
interface QueryResponse {
  demoUser?: Record<string, string | boolean | number>;
}

const UserProfile = (): JSX.Element => {
  const [updated, setUpdate] = useState(false);

  async function fetchQuery(operation, variables): Promise<{}> {
    const response = await fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: operation.text,
        variables,
      }),
    });

    return response.json();
  }

  const modernEnvironment: Environment = new Environment({
    network: Network.create(fetchQuery),
    store: new Store(new RecordSource()),
  });

  const mutationGQL = graphql`
    mutation UserProfile_AddUserMutation($input: AddUserInput!) {
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

  const specifications: PeriqlesSpecifications = {
    header: 'Sign Up',
    fields: {
      // gender: {
      //   element: 'radio',
      //   label: 'Gender',
      //   options: [
      //     {label: 'Non-binary', value: 'NON_BINARY'},
      //     {label: 'Male', value: 'MALE'},
      //     {label: 'Female', value: 'FEMALE'},
      //   ],
      // },
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

  const onSuccess = (response) => {
    setUpdate(!updated);
  };

  const onFailure = (error) => {
    alert(`Problem submitting form: ${error.toString()}`);
  };

  const args = {clientMutationId: '0000'};

  return (
    <div>
      <section className="UserProfile">
          <PeriqlesForm
            environment={modernEnvironment}
            mutationName={'AddUser'}
            mutationGQL={mutationGQL}
            specifications={specifications}
            args={args}
            callbacks={{onSuccess, onFailure}}
          />
          <main className="UserProfile-main">
            <h2>Most Recently Added User</h2>
            <QueryRenderer
              environment={modernEnvironment}
              query={graphql`
                query UserProfileQuery {
                  demoUser {
                    userId
                    username
                    password
                    email
                    gender
                    pizzaTopping
                    age
                  }
                }
              `}
            render={({error, props}: {error: Error; props: QueryResponse}) => {
              if (props && !props.demoUser) {
                return <p>Sign up...</p>;
              }
              if (props && props.demoUser) {
                const {demoUser} = props;
                return (
                  <div>
                    <p><label>Username:</label> {demoUser.username}</p>
                    <p><label>Email:</label> {demoUser.email}</p>
                    <p><label>Gender:</label> {demoUser.gender}</p>
                    <p><label>Favorite Pizza Topping:</label> {demoUser.pizzaTopping}</p>
                    <p><label>Age:</label> {demoUser.age}</p>
                  </div>
                );
              } else if (error) {
                console.error(error);
                return <p>Something went wrong...</p>;
              }

              return <p>Loading...</p>;
            }}
          />
        </main>
      </section>
      <section className="CodeDemo">
        <h1>Relay Code Examples</h1>
        <section className="Codeblocks">
          <section className="SchemaCode">
            <h3>Mutation Schema</h3>
            <SyntaxHighlighter language="js" style={vscDarkPlus} showLineNumbers={true} codeTagProps={{style: {fontSize: "inherit"}}} customStyle={{fontSize: 18}}>
                {"mutation UserProfile_AddUserMutation($input: AddUserInput!) {\n"+
                "  addUser(input: $input) {\n"+
                "    userId\n"+
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
              "  environment={modernEnvironment}\n"+
              "  mutationName={\'AddUser\'}\n"+
              "  mutationGQL={mutationGQL}\n"+
              "  specifications={specifications}\n"+
              "  args={args}\n"+
              "  callbacks={{onSuccess, onFailure}}\n"+
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

export default UserProfile;
