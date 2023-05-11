const express = require("express")

const app = express()

const cors = require('cors')


const port = process.env.PORT || 5000

app.use(cors());

app.use(express.json());

require('dotenv').config();





// here is mongodb connection configs 

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_EMAIL}:${process.env.DB_PASS}@cluster0.iqgllty.mongodb.net/?retryWrites=true&w=majority`;

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


        const database = client.db("total").collection("totaldata")

        app.get('/total', async (req, res) => {

            let couror = database.find()

            let result = await couror.toArray()

            res.send(result)

        })


        app.get('/total/:id', async (req, res) => {

            const id = req.params.id

            const query = { _id: new ObjectId(id) }

            // here is sorting the values

            let options = {
                projection: { title: 1, price: 1, img: 1, service_id: 1 },
            }
            const result = await database.findOne(query, options)
            res.send(result)

        })


        // here is post method for checkout method

        const checkoutr = client.db("checkoutinfo").collection("checkoutDetailes")


        app.get('/checkout', async (req, res) => {

            let couror = checkoutr.find()

            let result = await couror.toArray()

            res.send(result)

        })



        app.post('/checkout', async (req, res) => {

            let user = req.body

            const result = await checkoutr.insertOne(user);

            console.log(user);

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

// here is mongodb connection configs ends 



// here is basic server running for testing server running or not running 

app.get("/", (req, res) => {

    res.send("server is running ")

})


app.listen(port, () => {
    console.log(`app is running on port${port}`);
})