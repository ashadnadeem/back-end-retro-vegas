const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL, {
    dbName: process.env.MONGODB_DB_NAME,
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB Connected');
}).catch((err) => {
    console.log(err.message);
});

// listen for requests for mongodb connection
mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to DB');
});
// listen for errors
mongoose.connection.on('error', (err) => {
    console.log(err.message);
});
// listen for disconnect event
mongoose.connection.on('disconnected', () => {
    console.log('Mongoose connection is disconnected');
});
// disconnect mongoose when app is closed
process.on('SIGINT', async() => {
    await mongoose.connection.close();
    process.exit(0);
});