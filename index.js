const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())





const uri = `mongodb+srv://${process.env.S_ADMIN}:${process.env.KEY}@cluster0.nef3v.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;



// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db("coffeehouseDB");
    const coffeescollections = database.collection("coffeescollections");

    app.get('/coffess', async(req,res)=>{
        const cursor = coffeescollections.find();
        const result = await cursor.toArray();
        res.send(result)

    })

    app.get('/coffess/:id', async(req,res)=>{
        const id = req.params.id;
        const query = {_id : new ObjectId(id)}
        const result = await coffeescollections.findOne(query);
        res.send(result)
    })

    app.post('/coffess', async(req,res)=>{
        const values = req.body;
        console.log('adding coffee', values);
        const result = await coffeescollections.insertOne(values);
        res.send(result)
        
    })
    app.put('/coffess/:id', async(req,res)=>{
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)};
        const options = {upsert: true};
        const updateData = {
            $set: req.body
        }
        const result = await coffeescollections.updateOne(filter, updateData, options)
        res.send(result)
    })
    app.delete('/coffess/:id', async(req,res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await coffeescollections.deleteOne(query)
        res.send(result)

    })

    

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);













app.get('/', (req,res)=>{
    res.send('hello world')
})
app.listen(port, ()=>{
    console.log(`server in runing inport number ${port}`);
    
})