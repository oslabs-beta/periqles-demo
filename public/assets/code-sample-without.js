import React, {useState} from 'react';
import { gql, useMutation } from '@apollo/client';

const Signup = () => {
  const [formState, setFormState] = useState({
    username: '',
    password: '',
    email: '',
    gender: 'non-binary',
    pizzaTopping: 'buffalo chicken',
    age: 0,
  });

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

  const handleChange = (e) => {
    const {name, value} = e.target;

    const newState = Object.assign({}, formState);
    newState[name] = value;
    setFormState(newState);
  };

  const handleSubmit = (e, fields) => {
    if (e.key === 'Enter' || e.type === 'click') {
      e.preventDefault(); // prevent page refesh
    }

    const required = ['username', 'password', 'email'];
    for (const key in formState) {
      if (required.includes(key) && formState[key] !== '') {
        required.splice(required.indexOf(key), 1);
      }
    }

    if (required.length) {
      window.alert(`The following fields are required: ${required.join(', ')}`);
      return;
    }

    const input = {...formState, ...args};
    const variables = {
      input,
    };

    useMutation({ variables })
      .then(response => {
        initializeForm(fields);
      })
      .catch(err => {
        alert('Problem submitting form:', err.message);
      })
  };

  return (<div>
     <h1>Sign Up</h1>
     <form
      className="PeriqlesForm"
      aria-labelledby="form"
      onSubmit={(e) => handleSubmit(e)}>
        <label>
          Username
          <input
            type="text"
            name="username"
            value={formState[username]}
            onChange={handleChange}></input>
        </label>
        <label>
          Password
          <input
            type="password"
            name="password"
            value={formState[password]}
            onChange={handleChange}></input>
        </label>
        <label>
          Email
          <input
            type="email"
            name="email"
            value={formState[email]}
            onChange={handleChange}></input>
        </label>
        <div>
          <label>Gender</label>
          <label>
            non-binary
            <input
              type="radio"
              name="gender"
              value="non-binary"
              onChange={handleChange}></input>
          </label>
          <label>
            male
            <input
              type="radio"
              name="gender"
              value="male"
              onChange={handleChange}></input>
          </label>
          <label>
            female
            <input
              type="radio"
              name="gender"
              value="female"
              onChange={handleChange}></input>
          </label>
        </div>
        <label>
          Favorite pizza topping
          <select
            name="pizzaTopping"
            defaultValue={''}
            onChange={handleChange}>
              <option value={''}>
                Choose one...
              </option>
              <option value="buffalo chicken">
                buffalo chicken
              </option>
              <option value="buffalo chicken">
                buffalo chicken
              </option>
              <option value="buffalo chicken">
                buffalo chicken
              </option>
              <option value="buffalo chicken">
                buffalo chicken
              </option>
              <option value="buffalo chicken">
                buffalo chicken
              </option>
          </select>
        </label>
        <label>
          Age
          <input
            type="number"
            name="age"
            value={formState[age]}
            onChange={handleChange}></input>
        </label>
        <button
            onClick={(e) => handleSubmit(e)}>
            Submit
          </button>
      </form>  
  </div>);
};









