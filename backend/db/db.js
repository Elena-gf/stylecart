const mongoose = require("mongoose");
const dbUrl = process.env.MONGO_URL;

const connectToDatabase = async () => {
  try {
    console.log("Conectando a:", dbUrl); 
    await mongoose.connect(dbUrl);
    console.log("Conexión a mongoDB exitosa");
  } catch (err) {
    console.log("Error al conectar con MongoDb");
  }
};

module.exports = connectToDatabase;