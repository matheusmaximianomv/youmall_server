import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../config/auth';

class Token {
  encoded(data) {
    return jwt.sign(data, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });
  }

  async decoded(token) {
    return promisify(jwt.verify)(token, authConfig.secret);
  }
}

export default new Token();
