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
    const achievementCollection = database.collection("achievement");
    const youtubeCollection = database.collection("youtube");
    const facebookCollection = database.collection("facebook");
    const newsCollection = database.collection("news");
    const aboutCollection = database.collection("about");
    const leadersCollection = database.collection("leader")
    const teamCollection = database.collection("team")

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

    // Get achievement data
    app.get('/achievement', async (req, res) => {
      try {
        const cursor = achievementCollection.find({});
        const achievement = await cursor.toArray();
        res.json(achievement);
      } catch (err) {
        res.status(500).send('Error fetching achievements');
      }
    });

    // Post achievement data (admin route)
    app.post("/achievement", async (req, res) => {
      const achievement = req.body;
      const result = await achievementCollection.insertOne(achievement);
      res.send(result);
    });

    // Get youtube data
    app.get('/youtube', async (req, res) => {
      try {
        const cursor = youtubeCollection.find({});
        const youtube= await cursor.toArray();
        res.json(youtube);
      } catch (err) {
        res.status(500).send('Error fetching youtube');
      }
    });

    // Post youtube data (admin route)
    app.post("/youtube", async (req, res) => {
      const youtube = req.body;
      const result = await youtubeCollection.insertOne(youtube);
      res.send(result);
    });

     // Get facebook data
     app.get('/facebook', async (req, res) => {
      try {
        const cursor = facebookCollection.find({});
        const facebook = await cursor.toArray();
        res.json(facebook);
      } catch (err) {
        res.status(500).send('Error fetching Facebook data');
      }
    });
    

    // Post facebook data (admin route)
    app.post("/facebook", async (req, res) => {
      const facebook = req.body;
      const result = await facebookCollection.insertOne(facebook);
      res.send(result);
    });

     // Get news data
     app.get('/news', async (req, res) => {
      try {
        const cursor = newsCollection.find({});
        const news= await cursor.toArray();
        res.json(news);
      } catch (err) {
        res.status(500).send('Error fetching news');
      }
    });

    // Post news data (admin route)
    app.post("/news", async (req, res) => {
      const news = req.body;
      const result = await newsCollection.insertOne(news);
      res.send(result);
    });

     //About Get Data
    app.get('/about', async (req, res) => {
      try {
        const cursor = aboutCollection.find({});
        const About = await cursor.toArray();
        res.json(About);
      } catch (err) {
        res.status(500).send('Error fetching About');
      }
    });

    // Post about data (admin route)
    app.post("/about", async (req, res) => {
      const about = req.body;
      const result = await aboutCollection.insertOne(about);
      res.send(result);
    });

      //Leader Get Data
      app.get('/leader', async (req, res) => {
        try {
          const cursor = leadersCollection.find({});
          const Leader = await cursor.toArray();
          res.json(Leader);
        } catch (err) {
          res.status(500).send('Error fetching About');
        }
      });
  
      // Post Leader data (admin route)
      app.post("/about", async (req, res) => {
        const Leader = req.body;
        const result = await leadersCollection.insertOne(about);
        res.send(result);
      });

      


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

  } finally {
    // Ensure the client will close when finished or on error
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
