const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

const DB_URI = 'mongodb://localhost:27017';
const DB_NAME = 'CCRewards';

const exportDB = async () => {
  const client = new MongoClient(DB_URI);

  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const collections = await db.listCollections().toArray();

    // Create export folder if it doesn't exist
    const exportDir = path.join(__dirname, 'db-export');
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir);
      console.log(' Created folder: db-export');
    }

    for (const { name } of collections) {
      const data = await db.collection(name).find({}).toArray();
      const filePath = path.join(exportDir, `${name}.json`);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      console.log(`Exported ${name} to ${filePath}`);
    }

    console.log(' All collections exported successfully.');
  } catch (err) {
    console.error('Error exporting database:', err);
  } finally {
    await client.close();
  }
};

module.exports = exportDB;

 exportDB();
