import { v4 as uuidv4 } from 'uuid';
import sha1 from 'sha1';

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }

    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    const db = req.db;

    try {
      const userExists = await db.collection('users').findOne({ email });
      if (userExists) {
        return res.status(400).json({ error: 'Already exist' });
      }

      const hashedPassword = sha1(password);
      const newUser = {
        email,
        password: hashedPassword,
      };

      const result = await db.collection('users').insertOne(newUser);

      return res.status(201).json({ id: result.insertedId, email });
    } catch (error) {
      console.error('User creation error:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default UsersController;
