import multer from 'multer';
import crypto from 'crypto';
import { resolve, extname } from 'path';

function fileFilter(req, file, callback) {
  const { mimetype } = file;
  const [type, subtype] = mimetype.split('/');

  const allowedSubtypes = ['png', 'jpeg', 'jpg'];

  if (type !== 'image') {
    return callback(new Error('This type of file is not allowed'), false);
  }

  const validImage = allowedSubtypes.find((sub) => sub === subtype);

  if (validImage) {
    return callback(null, true);
  }
  return callback(new Error('This type of file is not allowed'), false);
}

function filenameProfile(req, file, callback) {
  crypto.randomBytes(16, (err, res) => {
    if (err) {
      return callback(err);
    }

    return callback(null, res.toString('hex') + extname(file.originalname));
  });
}

export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads', 'products'),
    filename: filenameProfile,
  }),
  fileFilter,
};
