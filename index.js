const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb'); // Import ObjectId
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve uploaded files

const uri = "mongodb+srv://marufrony48:173-115-012@cluster0.o1dvu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append extension
  },
});
const upload = multer({ storage });

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
    const leadersCollection = database.collection("leader");
    const teamsCollection = database.collection("team");
    const programmesCollection = database.collection("Programme");
    const homeCollection = database.collection("home");
    const missionVisionCollection = database.collection('mission-vision');
    const reviewsCollection = database.collection('review');

    // Contact routes
    app.post('/contact', async (req, res) => {
      const contact = req.body;
      const result = await contactsCollection.insertOne(contact);
      res.send(result);
    });

    // Review routes
    app.post('/review', async (req, res) => {
      const review = req.body;
      const result = await reviewsCollection.insertOne(review);
      res.send(result);
    });

    app.get('/review', async (req, res) => {
      try {
        const reviews = await reviewsCollection.find().toArray();
        res.status(200).json(reviews);
      } catch (error) {
        res.status(500).send(error);
      }
    });










    // Schedule routes
     app.get('/schedule', async (req, res) => {
  try {
    const schedules = await schedulesCollection.find().toArray();
    res.json(schedules);
  } catch (err) {
    res.status(500).send('Error fetching schedules: ' + err.message);
  }
    });
    // Post a schedule
    app.post("/schedule", upload.single('image'), async (req, res) => {
      try {
        const { title, description } = req.body;

        if (!req.file) {
          return res.status(400).send('Image upload failed: No file received.');
        }

        const imageUrl = `http://localhost:${port}/uploads/${req.file.filename}`;
        const schedule = { title, description, imageUrl };
        const result = await schedulesCollection.insertOne(schedule);
        res.send(result);
      } catch (error) {
        console.error('Upload error:', error);
        res.status(500).send('Image upload failed: ' + error.message);
      }
    });

    // Update a schedule
      app.put("/schedule/:id", upload.single('image'), async (req, res) => {
        try {
          const { id } = req.params;
          const { title, description } = req.body;
          let updatedSchedule = { title, description };
  
          if (req.file) {
            const imageUrl = `http://localhost:${port}/uploads/${req.file.filename}`;
            updatedSchedule.imageUrl = imageUrl;
          }
  
          const result = await schedulesCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updatedSchedule }
          );
          res.send(result);
        } catch (error) {
          res.status(500).send('Error updating schedule: ' + error.message);
        }
      });
  
    // Delete a schedule
    app.delete('/schedule/:id', async (req, res) => {
  try {
    const result = await schedulesCollection.deleteOne({ _id: new ObjectId(req.params.id) });

    if (result.deletedCount === 0) {
      return res.status(404).send('Schedule not found');
    }
    res.status(200).send('Schedule deleted successfully');
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).send('Server error');
  }
      });






 // achievement routes
app.get('/achievement', async (req, res) => {
  try {
    const achievements = await achievementCollection.find().toArray();
    res.json(achievements); // Correctly send the fetched achievements
  } catch (err) {
    res.status(500).send('Error fetching achievements: ' + err.message);
  }
});

// Post a achievement
app.post("/achievement", upload.single('image'), async (req, res) => {
  try {
    const { type, position, location, locationDate } = req.body;

    if (!req.file) {
      return res.status(400).send('Image upload failed: No file received.');
    }

    const imageUrl = `http://localhost:${port}/uploads/${req.file.filename}`;
    const achievement = { type, position, location, locationDate, imageUrl };
    const result = await achievementCollection.insertOne(achievement);
    
    res.status(201).json(result.ops[0]); // Return the newly created achievement
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).send('Image upload failed: ' + error.message);
  }
});


// Update a achievement
app.put("/achievement/:id", upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { type, position, location, locationDate } = req.body;
    let updatedAchievement = { type, position, location, locationDate };

    if (req.file) {
      const imageUrl = `http://localhost:${port}/uploads/${req.file.filename}`;
      updatedAchievement.imageUrl = imageUrl;
    }

    const result = await achievementCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedAchievement }
    );

    if (result.matchedCount === 0) {
      return res.status(404).send('Achievement not found');
    }

    res.send('Achievement updated successfully');
  } catch (error) {
    res.status(500).send('Error updating achievement: ' + error.message);
  }
});

// Delete a achievement
app.delete('/achievement/:id', async (req, res) => {
  try {
    const result = await achievementCollection.deleteOne({ _id: new ObjectId(req.params.id) });

    if (result.deletedCount === 0) {
      return res.status(404).send('Achievement not found');
    }
    res.send('Achievement deleted successfully');
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).send('Server error');
  }
});


// Programme routes
app.get('/programme', async (req, res) => {
  try {
    const programme = await programmesCollection.find().toArray();
    res.json(programme);
  } catch (err) {
    res.status(500).send('Error fetching programme: ' + err.message);
  }
    });


   // Get all Programmes
app.get('/programme', async (req, res) => {
  try {
    const programme = await programmesCollection.find().toArray();
    res.json(programme);
  } catch (err) {
    res.status(500).send('Error fetching programme: ' + err.message);
  }
});

// Post a Programme
app.post("/programme", upload.single('image'), async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!req.file) {
      return res.status(400).send('Image upload failed: No file received.');
    }

    const imageUrl = `http://localhost:${port}/uploads/${req.file.filename}`;
    const programme = { title, description, imageUrl };
    const result = await programmesCollection.insertOne(programme);
    res.send(result);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).send('Image upload failed: ' + error.message);
  }
});

// Update a Programme
app.put("/programme/:id", upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    let updatedSchedule = { title, description };

    if (req.file) {
      const imageUrl = `http://localhost:${port}/uploads/${req.file.filename}`;
      updatedSchedule.imageUrl = imageUrl;
    }

    const result = await programmesCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedSchedule }
    );
    res.send(result);
  } catch (error) {
    res.status(500).send('Error updating programme: ' + error.message);
  }
});

// Delete a Programme
app.delete('/programme/:id', async (req, res) => {
  try {
    const result = await programmesCollection.deleteOne({ _id: new ObjectId(req.params.id) });

    if (result.deletedCount === 0) {
      return res.status(404).send('Programme not found');
    }
    res.status(200).send('Programme deleted successfully');
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).send('Server error');
  }
});



















    // YouTube routes
    app.get('/youtube', async (req, res) => {
      try {
        const youtube = await youtubeCollection.find().toArray();
        res.json(youtube);
      } catch (err) {
        res.status(500).send('Error fetching youtube data');
      }
    });

    app.post("/youtube", async (req, res) => {
      const youtube = req.body;
      const result = await youtubeCollection.insertOne(youtube);
      res.send(result);
    });

    // Facebook routes
    app.get('/facebook', async (req, res) => {
      try {
        const facebook = await facebookCollection.find().toArray();
        res.json(facebook);
      } catch (err) {
        res.status(500).send('Error fetching Facebook data');
      }
    });

    app.post("/facebook", async (req, res) => {
      const facebook = req.body;
      const result = await facebookCollection.insertOne(facebook);
      res.send(result);
    });

    // News routes
    app.get('/news', async (req, res) => {
      try {
        const news = await newsCollection.find().toArray();
        res.json(news);
      } catch (err) {
        res.status(500).send('Error fetching news');
      }
    });

    app.post("/news", async (req, res) => {
      const news = req.body;
      const result = await newsCollection.insertOne(news);
      res.send(result);
    });

    // About routes
    app.get('/about', async (req, res) => {
      try {
        const about = await aboutCollection.find().toArray();
        res.json(about);
      } catch (err) {
        res.status(500).send('Error fetching About');
      }
    });

    app.post("/about", async (req, res) => {
      const about = req.body;
      const result = await aboutCollection.insertOne(about);
      res.send(result);
    });

    // Leader routes
    app.get('/leader', async (req, res) => {
      try {
        const leader = await leadersCollection.find().toArray();
        res.json(leader);
      } catch (err) {
        res.status(500).send('Error fetching Leader');
      }
    });

    app.post("/leader", async (req, res) => {
      const leader = req.body;
      const result = await leadersCollection.insertOne(leader);
      res.send(result);
    });

    // Team routes
    app.get('/team', async (req, res) => {
      try {
        const team = await teamsCollection.find().toArray();
        res.json(team);
      } catch (err) {
        res.status(500).send('Error fetching Team');
      }
    });

    app.post("/team", async (req, res) => {
      const team = req.body;
      const result = await teamsCollection.insertOne(team);
      res.send(result);
    });

    // // Programme routes
    // app.get('/programme', async (req, res) => {
    //   try {
    //     const programme = await programmesCollection.find().toArray();
    //     res.json(programme);
    //   } catch (err) {
    //     res.status(500).send('Error fetching Programme');
    //   }
    // });

    // app.post("/programme", async (req, res) => {
    //   const programme = req.body;
    //   const result = await programmesCollection.insertOne(programme);
    //   res.send(result);
    // });

    // Home routes
    app.get('/home', async (req, res) => {
      try {
        const home = await homeCollection.find().toArray();
        res.json(home);
      } catch (err) {
        res.status(500).send('Error fetching Home');
      }
    });

    app.post("/home", async (req, res) => {
      const home = req.body;
      const result = await homeCollection.insertOne(home);
      res.send(result);
    });

    // Mission and Vision routes
    app.get('/mission-vision', async (req, res) => {
      try {
        const missionVision = await missionVisionCollection.find().toArray();
        res.json(missionVision);
      } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching mission and vision data');
      }
    });

    app.post("/mission-vision", async (req, res) => {
      try {
        const missionVisionData = req.body;
        const result = await missionVisionCollection.insertOne(missionVisionData);
        res.send(result);
      } catch (err) {
        console.error(err);
        res.status(500).send('Error posting mission and vision data');
      }
    });

    await client.db("admin").command({ ping: 1 });
    console.log("Successfully connected to MongoDB!");

  } finally {
    // Ensure the client will close when finished/error
    // await client.close();
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
