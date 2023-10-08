require('dotenv').config({ path: '../.env' });

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const { ApolloServer } = require('apollo-server-express');
const { authMiddleware } = require('./utils/auth');
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Connect to MongoDB Atlas using the URI from environment variables
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // Other options...
  })
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB Atlas:', err);
  });

// authMiddleware
app.use(authMiddleware);

// Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }), // Authentication
});

// Middleware to express
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