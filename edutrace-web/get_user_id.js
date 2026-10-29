const mongoose = require('mongoose');

async function getFirstUserId() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/edutrace');
    
    // Using a dynamic schema to just grab any user and read its _id
    const userSchema = new mongoose.Schema({}, { strict: false, collection: 'users' });
    const User = mongoose.model('User', userSchema);
    
    const user = await User.findOne();
    if (user) {
      console.log("USER_ID_FOUND: " + user._id.toString());
    } else {
      console.log("NO_USERS_FOUND");
    }
  } catch (err) {
    console.error("ERROR:", err);
  } finally {
    await mongoose.disconnect();
  }
}

getFirstUserId();
