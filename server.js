require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());


const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://nigelsimon77:NiGeLsImOn@mydatabase.19wotef.mongodb.net/?retryWrites=true&w=majority&appName=mydatabase';
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});


const profileRoutes = require('./routes/profileRoutes');
const jobRoutes = require('./routes/jobRoutes');

app.use('/profiles', profileRoutes);
app.use('/jobs', jobRoutes);


app.get('/', (req, res) => {
    res.send('Welcome go to the profiles pages');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
