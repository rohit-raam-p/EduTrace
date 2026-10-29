const mongoose = require('mongoose');
async function check() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/edutrace');
  const coll = mongoose.connection.collection('sensorreadings');
  const stringCount = await coll.countDocuments({ userId: "69c02c0f12873bf9b3ac29ba" });
  const objectIdCount = await coll.countDocuments({ userId: new mongoose.Types.ObjectId("69c02c0f12873bf9b3ac29ba") });
  console.log(`String matches: ${stringCount}`);
  console.log(`ObjectId matches: ${objectIdCount}`);
  process.exit(0);
}
check();
