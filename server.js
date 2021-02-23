const express = require('express');
const {graphqlHTTP}  = require('express-graphql');
const path = require('path');
const cors = require('cors');
const {schema} = require('./data/schema/index.js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use('*', (req, res, next) => {
  console.log('Incoming request:', req.method, req.baseUrl);
  return next();
});

// only needed when in production mode
if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === undefined) {
  app.get('/', (req, res) => {
    return res.status(200)
          .sendFile(path.join(__dirname, '/public/index.html'));
  });
  app.get('/index.css', (req, res) => {
    return res.status(200)
          .set('Content-Type', 'text/css')
          .sendFile(path.join(__dirname, '/public/index.css'));
  });
  app.use('/dist/', express.static(path.join(__dirname, 'dist')));
}



// Set up GraphQL endpoint for POSTs
app.post(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    pretty: true,   // pretty-print JSON responses
  }),
);

// Send a GET to /graphql to use GraphiQL in the dev environment
if (process.env.NODE_ENV === 'development'){
  app.get(
    '/graphql',
    graphqlHTTP({
      schema: schema,
      pretty: true,
      graphiql: true,
    }),
  );
}

app.use(express.json());

//ERROR HANDLING
app.use((err, req, res, next) => {
  const error = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: {
      err: 'A server error occured',
    },
  };
  error.message = err.message;
  if (err.status) error.status = err.status;

  console.log('SERVER ERROR: ', error.message);
  res.status(error.status).send(error.message);
});

app.listen(PORT, () => {
  console.log(`Backend server listening on port: ${PORT}`);
});
