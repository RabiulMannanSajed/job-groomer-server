const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const multer = require("multer");
const path = require("path");
app.use(cors());
app.use(express.json());
// from mongodb

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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

    // this is for users
    const usersCollection = client.db("JobEntry").collection("users");

    // this is for question collection
    const quesCollection = client.db("JobEntry").collection("ques");
    // take the user info
    const userApplyInfoCollection = client.db("JobEntry").collection("apply");
    const commentCollection = client.db("JobEntry").collection("comment");
    const tutorialCollection = client.db("JobEntry").collection("tutorial");

    app.get("/office", async (req, res) => {
      const result = await officeCollection.find().toArray();
      res.send(result);
    });
    app.post("/office", async (req, res) => {
      const newOffice = req.body;
      const result = await officeCollection.insertOne(newOffice);
      res.send(result);
    });
    app.get("/ques", async (req, res) => {
      const result = await quesCollection.find().toArray();
      res.send(result);
    });
    app.get("/tutorial", async (req, res) => {
      const result = await tutorialCollection.find().toArray();
      res.send(result);
    });
    // tutorial
    app.post("/tutorial", async (req, res) => {
      const t = req.body;
      const result = await tutorialCollection.insertOne(t);
      res.send(result);
    });
    // to see all users
    app.get("/users", async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    });
    //this is the post method of user info take data form user this is form signUp
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    // comment
    app.get("/comment", async (req, res) => {
      const result = await commentCollection.find().toArray();
      res.send(result);
    });
    app.post("/comment", async (req, res) => {
      const comment = req.body;
      const result = await commentCollection.insertOne(comment);
      res.send(result);
    });
    // tutorial
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, "public/pdf");
      },
      filename: (req, file, cb) => {
        cb(
          null,
          file.fieldname + "_" + Date.now() + path.extname(file.originalname)
        );
      },
    });
    const upload = multer({
      storage: storage,
    });
    app.post("/upload", upload.single("file"), (req, res) => {
      console.log(req.file);
    });
    app.get("/pdf/:filename", async (req, res) => {
      const fileName = req.params.filename;
      const filePath = path.join(__dirname, "public/pdf", fileName);

      // Check if the file exists before sending
      if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
      } else {
        res.status(404).json({ error: "File not found" });
      }
    });
    //make user admin and office woner test
    app.patch("/users/admin/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          role: "admin",
          officeName: "olloy",
        },
      };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    // // this is for  update single user amd make him admin
    // app.patch("/users/admin/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const filter = { _id: new ObjectId(id) };
    //   const updateDoc = {
    //     $set: {
    //       role: "admin",
    //     },
    //   };
    //   const result = await usersCollection.updateOne(filter, updateDoc);
    //   res.send(result);
    // });
    // make the user admin of his office
    app.patch("/users/updateProfile/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          github: "",
          jobStates: "",
          pdf: "",
        },
      };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.send(result);
    });
    app.patch("/users/officeName/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          officeName: "olloy",
        },
      };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await usersCollection.deleteOne(query);
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
