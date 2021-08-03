const express = require('express');
const app = express();
const cors = require('cors');
const errorHandler = require('./app/helpers/errorHandler');

const corsOptions = {
  origin: "http://localhost:3000"
};

app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(express.json());  /* bodyParser.json() is deprecated */

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));   /* bodyParser.urlencoded() is deprecated */

const db = require("./app/models");
db.sequelize.sync();
// drop the table if it already exists
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });


// api routes
require("./app/routes/user.routes")(app);
require("./app/routes/product.routes")(app);

// global error handler
app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? 80 : 4000;
const server = app.listen(port, function () {
  console.log('Server listening on port ' + port);
});