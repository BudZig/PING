import mongoose from "mongoose";

const uri: string = 'mongodb+srv://P1ro:oDOaxYB8Du3Y9GJx@piro.f8cbqeh.mongodb.net/ping?retryWrites=true&w=majority';

try {
  mongoose.connect(uri);
  console.log('💗 Connected to database 💗');
} catch (error) {
  console.error(error);
}


module.exports = mongoose;

