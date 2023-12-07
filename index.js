const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
// from mongodb

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z68se.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const officeCollection = client.db("JobEntry").collection("office");

    // this is for question collection
    const quesCollection = client.db("JobEntry").collection("ques");
    // take the user info
    const userApplyInfoCollection = client.db("JobEntry").collection("apply");

    app.get("/office", async (req, res) => {
      const result = await officeCollection.find().toArray();
      res.send(result);
    });

    app.get("/ques", async (req, res) => {
      const result = await quesCollection.find().toArray();
      res.send(result);
    });

    // take the use info form client site
    app.post("/apply", async (req, res) => {
      const userInfo = req.body;
      const result = await userApplyInfoCollection.insertOne(userInfo);
      res.send(result);
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("this is our Job entry server ");
});
app.listen(port, () => {
  console.log(`Job entry is running Port ${port}`);
});
