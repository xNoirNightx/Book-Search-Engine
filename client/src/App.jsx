import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';

import App from './App';

// Apollo Client
const client = new ApolloClient({
  uri: 'http://localhost:3001/graphql', // does link change once added to heroku ? 
  cache: new InMemoryCache(),
});

// polloProvider
ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);

export default App;
