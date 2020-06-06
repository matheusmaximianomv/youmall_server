import Bcrypt from '../lib/Bcrypt';

import connection from '../../database';

class AccountController {
  async store(req, res) {
    const { username, fullname, email, password, cpf } = req.body;

    const [userWithEmailExist] = await connection('users')
      .count('id as count')
      .where('email', email);

    if (userWithEmailExist.count) {
      return res.status(400).json({ error: 'Email already in use.' });
    }

    const [userWithUsernameExist] = await connection('users')
      .count('id as count')
      .where('username', username);

    if (userWithUsernameExist.count) {
      return res.status(400).json({ error: 'Username already in use.' });
    }

    const [userWithCpfExist] = await connection('users')
      .count('id as count')
      .where('cpf', cpf);

    if (userWithCpfExist.count) {
      return res.status(400).json({ error: 'CPF already in use.' });
    }

    const password_hash = await Bcrypt.encrypt(password);

    await connection('users').insert({
      username,
      fullname,
      email,
      password: password_hash,
      cpf,
    });

    return res.status(201).json();
  }
}

export default new AccountController();
