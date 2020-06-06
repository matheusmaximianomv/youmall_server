import bcrypt from 'bcryptjs';

class Bcrypt {
  encrypt(password) {
    return bcrypt.hash(password, 12);
  }

  compare(password, password_hash) {
    return bcrypt.compare(password, password_hash);
  }
}

export default new Bcrypt();
