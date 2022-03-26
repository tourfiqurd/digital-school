const express = require("express")
const cors = require("cors")
require('dotenv').config();

const { MongoClient, ServerApiVersion } = require('mongodb');



const app = express()
const port = process.env.PORT || 5000
app.use(express.json())
app.use(cors())


const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Pass}@cluster0.tgpgy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const database = client.db("project");
        const haiku = database.collection("school");
        const videoLessonCollection = database.collection("vLesson")
        const QuizCollection = database.collection("qLesson")
        const usersCollection = database.collection("u-cls")
        const announcementCollection = database.collection("u-announcement")
        const video = { videoTitle: 'গুগলে ইন্টারভিউ ধাপ ও প্রোগ্রামিং জার্নি ', videoLink: 'https://www.youtube.com/embed/oxIJ725SluY', ReadingClass: 10 }
        // create a document to insert.
        const ResisterdTeacher = {
            title: "Daffodil",
            link: "https://drive.google.com/file/d/1s6oMc0I0J7_ftL5CvJZ9J4Fd76-5tcO7/view?usp=sharing"

        }



        app.get("/videos", async (req, res) => {
            const videos = videoLessonCollection.find({})
            const query = await videos.toArray()
            res.send(query)
        })
        app.get("/users", async (req, res) => {
            const users = usersCollection.find({})
            const query = await users.toArray()
            res.send(query)
        })
        app.get("/users/:email", async (req, res) => {
            const email = req.params.email
            const query = { email: email }


            const result = await usersCollection.findOne(query)
            res.send(result)



        })

        app.get("/teachers", async (req, res) => {
            const users = usersCollection.find({ role: "Teacher" })
            const query = await users.toArray()
            res.send(query)
        })


        app.get("/quizQuestions", async (req, res) => {


            const testy = {}

            const users = QuizCollection.find(testy)
            const query = await users.toArray()
            res.send(query)
        })
        app.get("/announceMent", async (req, res) => {


            const Annoucements = announcementCollection.find({})
            const query = await Annoucements.toArray()
            res.send(query)



        })
        app.post("/announceMent", async (req, res) => {
            console.log("object");
            console.log(req.body);
            const result = await announcementCollection.insertOne(req.body);
            res.send(result)
            console.log("object");






        })


        app.post("/quizQuestions", async (req, res) => {
            const content = req.body
            const result = await QuizCollection.insertOne(content);
            res.send(result)


        })

        app.post("/videos", async (req, res) => {

            const videoObject = req.body
            console.log(videoObject);
            const result = await videoLessonCollection.insertOne(videoObject);
            res.send(result)

        })
        app.post("/users", async (req, res) => {
            const teacher = req.body
            const filter = { email: teacher.email };
            // this option instructs the method to create a document if no documents match the filter
            const options = { upsert: true };
            // create a document that sets the plot of the movie
            const updateDoc = {
                $set: teacher
            };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.send(result)

        })






    } finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get("/", (req, res) => {
    res.send("fdsfdsfd")
})


app.listen(port, () => {
    console.log("running port at", port)
})