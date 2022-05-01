const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require ('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();

//Middleware
app.use(cors());
app.use(express.json());
//.......MongoDb add.....


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jz72n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("startech-bd").collection("product");
  // perform actions on the collection object
  console.log('mongo cannection')
  client.close();
});


//...............
app.get('/', (req, res) => {
   res.send('connected to star tec bd computer');
});



//...................
app.listen(port, () => {
   console.log('star tec bd CMD = ', port);
})


// DB_USER=sanu2022
// DB_PASSWORD=JroNiO2zBVKHlTE1