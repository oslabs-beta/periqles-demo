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
  uri: 'http://localhost:3000/graphql/apollo'
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <ApolloUserProfile />
  </ApolloProvider>,
  document.getElementById('root')
);