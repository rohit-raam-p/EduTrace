const mongoose = require('mongoose');

async function test() {
  await mongoose.connect('mongodb://127.0.0.1:27017/edutrace');
  const userIdStr = "69c02c0f12873bf9b3ac29ba";

  const SensorReading = mongoose.connection.collection('sensorreadings');

  // Exact aggregation run by route.ts
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

  const readings = grouped.map(g => ({
    ...g.doc,
    history: g.history.slice(0, 20).reverse()
  }));

  console.log('Resulting sensors data length:', readings.length);
  readings.forEach(r => {
    console.log(`${r.nodeId} -> ${r.value} (status: ${r.status}, time: ${r.timestamp})`);
  });
  
  process.exit(0);
}
test();
