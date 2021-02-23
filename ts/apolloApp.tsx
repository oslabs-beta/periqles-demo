import {
  ApolloClient,
  NormalizedCacheObject,
  ApolloProvider
} from '@apollo/client';
import { cache } from './apolloCache';
import React from 'react';
import ReactDOM from 'react-dom';
import ApolloUserProfile from './components/ApolloUserProfile';

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache,
  uri: 'https://periqles.herokuapp.com/graphql'
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <ApolloUserProfile />
  </ApolloProvider>,
  document.getElementById('root')
);