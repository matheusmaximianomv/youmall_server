import { resolve } from 'path';
import { unlink } from 'fs';
import { promisify } from 'util';

class File {
  async delete(filename) {
    try {
      const path = resolve(
        __dirname,
        '..',
        '..',
        '..',
        'tmp',
        'uploads',
        'products',
        filename
      );
      await promisify(unlink)(path);
      return true;
    } catch (error) {
      return false;
    }
  }
}

export default new File();
