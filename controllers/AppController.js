class AppController {
    static async getStatus(req, res) {
      const redisClient = req.redisClient;
      const db = req.db;
  
      let redisStatus = false;
      let dbStatus = false;
  
      try {
        await redisClient.connect();
        redisStatus = true;
        redisClient.disconnect();
      } catch (error) {
        console.error('Redis error:', error);
      }
  
      try {
        await db.command({ ping: 1 });
        dbStatus = true;
      } catch (error) {
        console.error('MongoDB error:', error);
      }
  
      res.status(200).json({ redis: redisStatus, db: dbStatus });
    }
  
    static async getStats(req, res) {
      const db = req.db;
  
      try {
        const usersCount = await db.collection('users').countDocuments();
        const filesCount = await db.collection('files').countDocuments();
  
        res.status(200).json({ users: usersCount, files: filesCount });
      } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ error: 'Unable to retrieve stats' });
      }
    }
  }
  
  export default AppController;
