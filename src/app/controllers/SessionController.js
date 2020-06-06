import connection from '../../database';

import Bcrypt from '../lib/Bcrypt';
import Token from '../lib/Token';

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;

    const [user] = await connection('users')
      .where('email', email)
      .limit(1)
      .select(
        'id',
        'fullname',
        'email',
        'password',
        'username',
        'isAdmin',
        'created_at',
        'updated_at'
      );

    if (!user) {
      return res.status(400).json({ error: 'Email or password invalid.' });
    }

    const {
      id,
      fullname,
      username,
      password: password_hash,
      isAdmin,
      created_at,
      updated_at,
    } = user;

    if (!(await Bcrypt.compare(password, password_hash))) {
      return res.status(400).json({ error: 'Email or password invalid.' });
    }

    return res.status(201).json({
      token: Token.encoded({ id, isAdmin }),
      fullname,
      email,
      username,
      isAdmin,
      created_at,
      updated_at,
    });
  }
}

export default new SessionController();
