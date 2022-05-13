const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion} = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require ('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();

//Middleware
app.use(cors());
app.use(express.json());
//.......MongoDb add.....

// mongggggggggggg
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jz72n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//   const collection = client.db("startech-bd").collection("product");
//   // perform actions on the collection object
//   console.log('mongo cannection')
//   client.close();
// });
//.........
async function run(){
   try{
      await client.connect();
      const productCollection = client.db('startech-bd').collection('products');
      const AddproductCollection = client.db('startech-bd').collection('addproducts');

      // JWT Token****************
      app.post('/login', async(req, res) => {
         const user = req.body;
         const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1d'
         });
         res.send({accessToken});
      })
      //....mongodb(find multiple docu:). All data load.
      app.get('/products', async(req, res) => {
         const query = {}
         const cursor = productCollection.find(query);
         const products = await cursor.toArray();
         res.send(products);
      })
      

      //.....Home page Product show Limited......
      app.get('/products', async(req, res) => {
         const query = {}
         const cursor = productCollection.find(query);
         const products = await cursor.limit(6).toArray();
         res.send(products);
      })

      // .....Add/Post Product.....
      app.post('/products', async(req, res) => {
         const newProduct = req.body;
         const result = await productCollection.insertOne(newProduct);
         res.send(result);
      })

      // My items......
      app.get('/products', async(req, res) => {
         const email = req.query.email;
         // console.log(email)
         const query = {email: email};
         const cursor = productCollection.find(query);
         const myItem = await cursor.toArray();
         res.send(myItem)
      })
      // Update Product
      app.get('/products/:id', async(req, res) => {
         const id = req.params.id;
         const query = {_id: ObjectId(id)};
         const result = await productCollection.findOne(query);
         res.send(result);
      })
      // Update PUT
      app.put('/products/:id', async(req, res) =>{
         const id = req.params.id;
         const updateProduct = req.body;
         const filter = {_id: ObjectId(id)};
         const options = {upsert: true};
         const updateDoc = {
            $set:{
               name: updateProduct.name,
               price: updateProduct.price,
               quantity: updateProduct.quantity,
               supplier: updateProduct.supplier,
               image: updateProduct.image,
               image2: updateProduct.image2,
               description: updateProduct.description
               
               
            }
         };
         const result = await productCollection.updateOne(filter, updateDoc, options);
         res.send(result);
      })

      // Update Product End

      // .....Delete Product......
      app.delete('/products/:id', async(req, res) => {
         const id = req.params.id;
         const query ={_id: ObjectId(id)};
         const result = await productCollection.deleteOne(query);
         res.send(result);
      });

      // .....End Delete Product....


      // Inventory update single id details search
      app.get('/inventory-update/:id', async(req, res) => {
         const id = req.params.id;
         const query = {_id:ObjectId(id)};
         const result = await productCollection.findOne(query);
         res.send(result);

      })
      // Inventory update product
      app.put('/inventory-update/:id', async(req, res) => {
         const id = req.params.id;
         const updatedProduct = req.body;
         const filter = {id:ObjectId(id)};
         const options = {upsert:true};
         const updateQuantity = {
            $set:{
               quantity: updatedProduct.quantity
            }
         };
         const result = await productCollection.updateOne(filter, updateQuantity, options);
         res.send(result);

      })



   }finally{

   }
}
run().catch(console.dir);


//...............
app.get('/', (req, res) => {
   res.send('connected to star tec bd computer');
});

app.get('/myProject', (req, res) =>{
   res.send('MY INVENTORY MANAGE APP')
})

//...................
app.listen(port, () => {
   console.log('star tec bd CMD = ', port);
})


// DB_USER=sanu2022
// DB_PASSWORD=JroNiO2zBVKHlTE1