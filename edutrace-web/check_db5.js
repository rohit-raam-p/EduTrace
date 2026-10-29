const mongoose = require('mongoose');
const fs = require('fs');
async function test() {
  await mongoose.connect('mongodb://127.0.0.1:27017/edutrace');
  const userIdStr = "69c02c0f12873bf9b3ac29ba";
  const SensorReading = mongoose.connection.collection('sensorreadings');

  const grouped = await SensorReading.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userIdStr) } },
    { $sort: { timestamp: -1 } },
    { $group: { 
        _id: '$nodeId', 
        doc: { $first: '$$ROOT' },
        history: { $push: '$value' }
      } 
    }
  ]).toArray();

  fs.writeFileSync('agg_out.json', JSON.stringify(grouped, null, 2));
  process.exit(0);
}
test();
