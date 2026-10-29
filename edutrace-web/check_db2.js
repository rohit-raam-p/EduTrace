const mongoose = require('mongoose');
const fs = require('fs');
async function check() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/edutrace');
  const d = await mongoose.connection.collection('sensorreadings').find().sort({timestamp:-1}).limit(3).toArray();
  fs.writeFileSync('latest_utf8.json', JSON.stringify(d, null, 2), 'utf8');
  process.exit(0);
}
check();
