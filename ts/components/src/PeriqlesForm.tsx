import * as React from 'react';
import PeriqlesField from './PeriqlesField';
import {introspect} from './functions';
import {commitMutation} from 'react-relay';
// import '../periqles.css'

const {useState, useEffect} = React;

const PeriqlesForm = ({
  environment,
  mutationName,
  mutationGQL,
  useMutation,
  specifications,
  args = {},
  callbacks,
}: PeriqlesFormProps): JSX.Element => {
  const [formState, setFormState] = useState<FormState>({});
  const [fields, setFields] = useState<PeriqlesFieldInfo[]>([]);
  const [formContents, setFormContents] = useState([<p>Loading form...</p>]);

  useEffect(() => {
    introspect(mutationName, setFields, args);
  }, [mutationName]);

  // HANDLERS
  const handleSubmit = (e, fields): void => {
    if (e.key === 'Enter' || e.type === 'click') {
      e.preventDefault(); // prevent page refesh
    }

    // validate non-null text fields
    // const fieldNames = Object.keys(formState);
    // for (let i = 0; i < fieldNames.length; i += 1) {
    const newState = {};
    let earlyReturn = false;
    console.log('current form state', formState);
    for (const key in formState) {
      console.log('Checking null status of ', key);
      if (typeof formState[key] === 'string') {
        newState[key] = '';
      }
      else if (typeof formState[key] === 'number') {
        newState[key] = 0;  // TODO: ranges that don't start at 0
      }
      // else newState[key] = false;  // TODO: not yet supporting boolean values correctly
      else newState[key] = undefined;

      const fieldObj = fields.filter(
        (fieldObj) => fieldObj.name === key,
      )[0];
      console.log('Matching fieldObj:', fieldObj);
      if (fieldObj.required && formState[key] === '' 
            || fieldObj.required && formState[key] === undefined) {
        console.log('required field:', fieldObj);
        window.alert(`The following field is required: ${fieldObj.label}`);
        earlyReturn = true;
      }
    }

    if (earlyReturn) return;

    const input: Input = {...formState, ...args};
    const variables: Variables = {
      input,
    };

    // if (environment) {
    //   // relay commit method
    //   commitMutation(environment, {
    //     mutation: mutationGQL,
    //     variables,
    //     onCompleted: (response, errors): void => {
    //       if (callbacks?.onSuccess) callbacks.onSuccess(response);
    //       // setFormState({});
    //       setFormState(newState);
    //     },
    //     onError: (err): void => {
    //       if (callbacks?.onFailure) callbacks.onFailure(err);
    //     },
    //   });
    // } else {
    //   // apollo commit method
    //   // actual invocation of addUser useMutation mutate function; if passing variables must be passed inside of an object
    //   useMutation({ variables })
    //   .then(response => {
    //     if (callbacks?.onSuccess) callbacks.onSuccess(response); // useMutation mutate function returns a promise of mutation result
    //     // setFormState({});
    //     setFormState(newState);
    //   })
    //   .catch(err => {
    //     if (callbacks?.onFailure) callbacks.onFailure(err); // if onFailure callback provided, invoke on useMutation mutate function promise error
    //   })
    // }
  };

  const handleChange = (e): void => {
    const {name, value, type} = e.target;
    let useValue = value;
    // type-coerce values from number input elements before storing in state
    if (type === 'number' && typeof value !== 'number') {
      useValue -= 0;
    }

    const newState = Object.assign({}, formState);
    newState[name] = useValue;
    setFormState(newState);
    setTimeout(() => console.log('state after handleChange', formState), 500, formState);
  };

  const renderFields = (fields: PeriqlesFieldInfo[]) => {
    // add each field to formState
    const initialValues = {};
    fields.forEach((field: PeriqlesFieldInfo) => {
      let initialValue;
      switch (field.type) {
        case 'String':
          initialValue = '';
          break;
        case 'Int':
          initialValue = 0;
          break;
        case 'Boolean':
          initialValue = false;
          // TODO: false not "false"
          break;
        case 'Enum':
          if (!field.options) {
            initialValue = '';
          } else {
            initialValue = field.options[0].name;
          }
          break;
        default:
          initialValue = '';
      }
      initialValues[field.name] = initialValue;
    });

    // console.log('starting values at line 138', initialValues);
    setFormState(initialValues); // queued up to finish after this function has finished
    // console.log('Set initial form state:', formState);

    // return an array of <PeriqlesField />
    setFormContents(fields.map((field: PeriqlesFieldInfo, index: number) => {
      const specs = specifications
        ? specifications.fields[field.name]
        : undefined;
      return (
        <PeriqlesField
          key={`Periqles${mutationName}Field${index}`}
          field={field}
          specs={specs}
          formState={formState}   // is passing an old version of state, {}, to PeriqlesFields, b/c queue hasn't allowed the setState call to execute yet
          setFormState={setFormState}
          handleChange={handleChange}
        />
      );
    }));
  };
  // console.log({formState}) // shows updated state

  useEffect(() => renderFields(fields), [fields.length, setFormState]);

  return (
    <form
      className="PeriqlesForm"
      aria-labelledby="form"
      onSubmit={(e) => handleSubmit(e, fields)}>
        {specifications && specifications.header && <h2>{specifications.header}</h2>}
      {formContents}
      <button
        className="periqles-submit"
        onClick={(e) => handleSubmit(e, fields)}>
        Submit
      </button>
    </form>
  );
};

export default PeriqlesForm;
