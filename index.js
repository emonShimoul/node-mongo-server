const express = require('express');
const app = express();
var cors = require('cors');
const { json } = require('express/lib/response');
const port = process.env.PORT || 5000;

app.use(cors());
// convert the string data to json
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://mydbuser1:5GTBgBhpP8tye52q@cluster0.pabg0.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
      await client.connect();
      const database = client.db("myDb");
      const usersCollection = database.collection("users");

      console.log("hitting the database");

      // POST API
      app.post('/users', async(req, res) => {
          const newUser = req.body;
          const result = await usersCollection.insertOne(newUser);
          console.log(`A document was inserted with the _id: ${result.insertedId}`);
          console.log(`Got new user: `, req.body);
          console.log(`added user `, result);
          res.json(result);
      });

      // GET API
      app.get('/users', async(req, res) => {
          const cursor = usersCollection.find({});
          const users = await cursor.toArray();
          res.send(users);
      });

    //   app.get('users/:id', async(req, res) => {
    //       const id = req.params.id;
    //       const query = { _id:ObjectId(id) };
    //       const user = await userCollection.findOne(query);
    //       console.log('load user with id: ', id);
    //       res.send(user);
    //   })

      // DELETE API
      app.delete('/users/:id', async(req, res) => {
        const id = req.params.id;
        const query = { _id:ObjectId(id) };
        const result = await usersCollection.deleteOne(query);
        console.log("successfully deleted user id", id); 
      })

    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log('Listening on port ', port);
})