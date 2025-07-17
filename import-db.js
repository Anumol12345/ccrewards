const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

const DB_URI = 'mongodb://localhost:27017'; // or Atlas URI
const DB_NAME = 'CCRewards';

const importDB = async () => {
  const client = new MongoClient(DB_URI);

  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const importDir = path.join(__dirname, 'db-export');
    const files = fs.readdirSync(importDir);

    for (const file of files) {
      if (file.endsWith('.json')) {
        const collectionName = path.basename(file, '.json');
        const filePath = path.join(importDir, file);
        const data = JSON.parse(fs.readFileSync(filePath));

        if (Array.isArray(data)) {
          const collection = db.collection(collectionName);
          await collection.deleteMany({}); // Optional: clear old data
          await collection.insertMany(data);
          console.log(`✅ Imported ${collectionName} (${data.length} records)`);
        }
      }
    }

    console.log('🎉 Import completed!');
  } catch (error) {
    console.error('❌ Import error:', error);
  } finally {
    await client.close();
  }
};

module.exports = importDB;
