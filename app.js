const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();


app.use(bodyParser.json());
app.use(express.static('public'));


mongoose.connect('mongodb://localhost:27017/teacherDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});


const teacherRoutes = require('./routes/teacherRoutes');
app.use('/api', teacherRoutes);


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
