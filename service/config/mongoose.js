const mongoose = require("mongoose");


const DB_URL = process.env.DB_URL || 'mongodb://127.0.0.1:27017/haha'
console.log('mongodb 접속시도: ' + DB_URL)

const options = {
  user: process.env.DB_USER || 'admin',
  pass: process.env.DB_PASSWORD || '@pkh778129',
  useNewUrlParser: true,
  useUnifiedTopology: true,
  server: {
      socketOptions: {
          keepAlive: 1,
          connectTimeoutMS: 30000,
          socketTimeoutMS: 50000,
      }
  },
  replset: {
      socketOptions: {
          keepAlive: 1,
          connectTimeoutMS: 30000,
          socketTimeoutMS: 50000,
      }
  },
  autoReconnect: true, 
  // serverSelectionTimeoutMS: 5000,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 5000, 
  poolSize: 10,
};

const connectWithRetry = () => {
  mongoose.connect(DB_URL, {
    user: options.user,
    pass: options.pass,
  }, options)
  .catch(err => {
    console.error('MongoDB Connection Error : ', err)
    setTimeout(connectWithRetry, 5000);
  })

  const db = mongoose.connection;

  db.on("error", (error) => {
    console.error("MongoDB 연결 에러:", error);
  });

  db.once("open", () => {
    console.log("MongoDB 연결 성공");
  });
};

connectWithRetry()



