const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://marufrony48:173-115-012@cluster0.o1dvu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    const database = client.db("cse-society"); 
    const contactsCollection = database.collection("contacts");
    const schedulesCollection = database.collection("schedule");

    // Send contact data
    app.post('/contact', async (req, res) => {
      const contact = req.body;
      const result = await contactsCollection.insertOne(contact);
      res.send(result);
    });

    // Get schedule data
    app.get('/schedule', async (req, res) => {
      try {
        const cursor = schedulesCollection.find({});
        const schedules = await cursor.toArray();
        res.json(schedules);
      } catch (err) {
        res.status(500).send('Error fetching schedules');
      }
    });

    // Post schedule data (admin route)
    app.post("/schedule", async (req, res) => {
      const schedule = req.body;
      const result = await schedulesCollection.insertOne(schedule);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Server is Running');
});

app.listen(port, () => {
    console.log(`Server is Running on port ${port}`);
});
