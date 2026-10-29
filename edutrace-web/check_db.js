const mongoose = require('mongoose');

async function check() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/edutrace');
  const SensorReading = mongoose.connection.collection('sensorreadings');
  const latest = await SensorReading.find({}).sort({ timestamp: -1 }).limit(10).toArray();
  console.log('LATEST 10 RECORDS:');
  latest.forEach(r => console.log(`${r.timestamp} | ${r.nodeId} | ${r.location} | ${r.type} | User: ${r.userId} | val: ${r.value}`));
  process.exit(0);
}
check();
