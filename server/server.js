const express = require('express');
const path = require('path');
const { ApolloServer } = require('apollo-server-express'); //  ApolloServer version 2 heere
const { authMiddleware } = require('./utils/auth'); 
const { typeDefs, resolvers } = require('./schemas'); 

const db = require('./config/connection');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// MongoDB
db.once('open', () => {
  console.log('Connected to the database');
});

// authMiddleware 
app.use(authMiddleware);

// Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }), //  authentication
});

// middleware to express
server.applyMiddleware({ app });

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.use(routes);


// Start the server
app.listen(PORT, () => {
  console.log(`🌍 Now listening on localhost:${PORT}`);
  console.log(`GraphQL Playground available at http://localhost:${PORT}${server.graphqlPath}`);
});
