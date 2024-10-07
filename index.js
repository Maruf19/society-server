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
    const userCollection = database.collection("users");
    const contactsCollection = database.collection("contacts");
    const contactInfoCollection = database.collection("contact-info");
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


    app.post("/users", async (req, res) => {
      const user = req.body;
      // Assign 'admin' or 'user' based on your logic
      user.role = 'user'; // Default role is 'user', you can customize this
      const result = await userCollection.insertOne(user);
      res.send(result);
    });


// Get all contacts
app.get('/contact', async (req, res) => {
  try {
    const contacts = await contactsCollection.find().toArray(); // Use toArray() to return an array
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contacts' });
  }
});

 // contact post
 app.post('/contact', async (req, res) => {
  const contact = req.body;
  const result = await contactsCollection.insertOne(contact);
  res.send(result);
});

// Delete a contact by ID
    app.delete('/contact/:id', async (req, res) => {
  try {
    const result = await contactsCollection.deleteOne({ _id: new ObjectId(req.params.id) });

    if (result.deletedCount === 0) {
      return res.status(404).send('Contact not found');
    }
    res.status(200).send('Contact deleted successfully');
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).send('Server error');
  }
      });



      // Get all contacts-info
app.get('/contact-info', async (req, res) => {
  try {
    const contactInfo = await contactInfoCollection.find().toArray(); // Use toArray() to return an array
    res.json(contactInfo);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contacts-Info' });
  }
});

app.post('/contact-info', async (req, res) => {
  try {
      const contactInfo = req.body;
      const result = await contactInfoCollection.insertOne(contactInfo);
      res.status(201).send(result); // 201 Created
  } catch (error) {
      console.error('Error inserting contact info:', error);
      res.status(500).send('Internal Server Error');
  }
});

// Delete a contact-info by ID
    app.delete('/contact-info/:id', async (req, res) => {
  try {
    const result = await contactInfoCollection.deleteOne({ _id: new ObjectId(req.params.id) });

    if (result.deletedCount === 0) {
      return res.status(404).send('Contact not found');
    }
    res.status(200).send('Contact deleted successfully');
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).send('Server error');
  }
      });


      
 
    // Review routes
    app.post('/review', async (req, res) => {
      const review = req.body;
      const result = await reviewsCollection.insertOne(review);
      res.send(result);
    });

    app.get('/review', async (req, res) => {
      try {
        const review = await reviewsCollection.find().toArray();
        res.status(200).json(review);
      } catch (error) {
        res.status(500).send(error);
      }
    });

   // Delete a Review by ID
    app.delete('/review/:id', async (req, res) => {
  try {
    const result = await reviewsCollection.deleteOne({ _id: new ObjectId(req.params.id) });

    if (result.deletedCount === 0) {
      return res.status(404).send('Review not found');
    }
    res.status(200).send('Review deleted successfully');
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).send('Server error');
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

// Team routes
app.get('/team', async (req, res) => {
 try {
   const team = await teamsCollection.find().toArray();
   res.json(team);
 } catch (err) {
   res.status(500).send('Error fetching schedules: ' + err.message)
 }
});

   // Post a team
   app.post("/team", upload.single('image'), async (req, res) => {
     try {
       const { name, role, description } = req.body;

       if (!req.file) {
         return res.status(400).send('Image upload failed: No file received.');
       }

       const imageUrl = `http://localhost:${port}/uploads/${req.file.filename}`;
       const team = { name, role, description, imageUrl };
       const result = await teamsCollection.insertOne(team);
       res.send(result);
     } catch (error) {
       console.error('Upload error:', error);
       res.status(500).send('Image upload failed: ' + error.message);
     }
   });

// Update a Team
app.put("/team/:id", upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, description } = req.body;
    let updatedTeam = { name, role, description };

    if (req.file) {
      const imageUrl = `http://localhost:${port}/uploads/${req.file.filename}`;
      updatedTeam.imageUrl = imageUrl;
    }

    const result = await teamsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedTeam }
    );

    if (result.matchedCount === 0) {
      return res.status(404).send('Team not found');
    }

    res.send('Team updated successfully');
  } catch (error) {
    res.status(500).send('Error updating team: ' + error.message);
  }
});

// Delete a Team
app.delete('/team/:id', async (req, res) => {
  try {
    const result = await teamsCollection.deleteOne({ _id: new ObjectId(req.params.id) });

    if (result.deletedCount === 0) {
      return res.status(404).send('Team not found');
    }
    res.status(200).send('Team deleted successfully');
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).send('Server error');
  }
});


// Leader routes
// Fetch all leaders
app.get('/leader', async (req, res) => {
  try {
    const leaders = await leadersCollection.find().toArray();
    res.json(leaders);
  } catch (err) {
    res.status(500).send('Error fetching leaders: ' + err.message);
  }
});

// Post a new leader
app.post('/leader', upload.single('image'), async (req, res) => {
  try {
    const { name, position } = req.body;

    // Check if all required fields are provided
    if (!name || !position) {
      return res.status(400).send('Name and position are required.');
    }

    // Check if the file was uploaded
    if (!req.file) {
      return res.status(400).send('Image upload failed: No file received.');
    }

    // Construct the image URL
    const imageUrl = `http://localhost:${port}/uploads/${req.file.filename}`;
    
    // Create the leader object
    const leader = { name, position, imageUrl };

    // Ensure you're referencing the correct collection
    const result = await leadersCollection.insertOne(leader);

    // Return the result of the insertion
    res.status(201).json(result);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).send('Image upload failed: ' + error.message);
  }
});

// Update a leader
app.put('/leader/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, position } = req.body;

    // Prepare the updated leader object
    const updatedLeader = { name, position };

    // Update image URL if a new file is uploaded
    if (req.file) {
      const imageUrl = `http://localhost:${port}/uploads/${req.file.filename}`;
      updatedLeader.imageUrl = imageUrl;
    }

    const result = await leadersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedLeader }
    );

    if (result.matchedCount === 0) {
      return res.status(404).send('Leader not found');
    }

    res.send('Leader updated successfully');
  } catch (error) {
    res.status(500).send('Error updating leader: ' + error.message);
  }
});

// Delete a leader
app.delete('/leader/:id', async (req, res) => {
  try {
    const result = await leadersCollection.deleteOne({ _id: new ObjectId(req.params.id) });

    if (result.deletedCount === 0) {
      return res.status(404).send('Leader not found');
    }
    res.status(200).send('Leader deleted successfully');
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
    
    app.delete('/facebook/:id', async (req, res) => {
      try {
        const result = await  facebookCollection.deleteOne({ _id: new ObjectId(req.params.id) });
    
        if (result.deletedCount === 0) {
          return res.status(404).send('Leader not found');
        }
        res.status(200).send('Leader deleted successfully');
      } catch (error) {
        console.error('Delete error:', error);
        res.status(500).send('Server error');
      }
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

 
    const { ObjectId } = require('mongodb');

    // DELETE request handler for deleting a news entry by ID
    app.delete('/news/:id', async (req, res) => {
      try {
        const { id } = req.params;
    
        // Ensure id is a valid ObjectId
        if (!ObjectId.isValid(id)) {
          return res.status(400).send('Invalid ID format');
        }
    
        const result = await newsCollection.deleteOne({ _id: new ObjectId(id) });
    
        if (result.deletedCount === 0) {
          // No document was deleted, indicating the ID does not exist
          return res.status(404).send('News entry not found');
        }
    
        // Successfully deleted
        res.status(200).send('News entry deleted successfully');
      } catch (error) {
        console.error('Delete error:', error);
        // Respond with server error in case of an unexpected issue
        res.status(500).send('Server error');
      }
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

    // Delete Mission-Vision
app.delete('/about/:id', async (req, res) => {
  try {
    const result = await  aboutCollection.deleteOne({ _id: new ObjectId(req.params.id) });

    if (result.deletedCount === 0) {
      return res.status(404).send('Leader not found');
    }
    res.status(200).send('Leader deleted successfully');
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).send('Server error');
  }
});

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

    // Delete Mission-Vision
app.delete('/mission-vision/:id', async (req, res) => {
  try {
    const result = await missionVisionCollection.deleteOne({ _id: new ObjectId(req.params.id) });

    if (result.deletedCount === 0) {
      return res.status(404).send('Leader not found');
    }
    res.status(200).send('Leader deleted successfully');
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).send('Server error');
  }
});

//PAYMENT INTREGATION

app.post("/create-payment", async (req, res) => {

const paymentInfo = (req.body);
console.log (paymentInfo) 

const initiateData = {
  store_id: "cseso67041bfe39834",
  store_passwd: "cseso67041bfe39834@ssl",
  total_amount: paymentInfo.amount,
  currency: "EUR",
  tran_id: "REF123",
  success_url: "http://yoursite.com/success.php",
  fail_url: "http://yoursite.com/fail.php",
  cancel_url: "http://yoursite.com/cancel.php",
  cus_name: "Customer Name",
  cus_email: "cust@yahoo.com",
  cus_add1: "Dhaka",
  cus_add2: "Dhaka",
  cus_city: "Dhaka",
  cus_state: "Dhaka",
  cus_postcode: "1000",
  cus_country: "Bangladesh",
  cus_phone: "01711111111",
  cus_fax: "01711111111",
  shipping_method: "NO",
  multi_card_name: "mastercard,visacard,amexcard",
  value_a: "ref001_A",
  value_b: "ref002_B",
  value_c: "ref003_C",
  value_d: "ref004_D"
};

  res.send(result);
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
  console.log(`Server is okay`);
});  

