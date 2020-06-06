import connection from '../../database';
import File from '../utils/File';

export default async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  if (req.method === 'POST') {
    const { filename: path, originalname } = req.file;

    const [id] = await connection('files').insert({
      path,
      originalname,
    });

    req.file.id_file = id;
  }

  if (req.method === 'PUT') {
    const { id: id_product } = req.params;

    const [{ path, id_file }] = await connection('products')
      .innerJoin('files', {
        'products.id_file': 'files.id',
      })
      .where('products.id', id_product)
      .select('*')
      .limit(1);

    if (!id_file) {
      const { filename, originalname } = req.file;

      const [id] = await connection('files').insert({
        path: filename,
        originalname,
      });

      req.file.id_file = id;
      req.file.changed = false;

      return next();
    }

    const { filename, originalname } = req.file;

    await File.delete(path);
    req.file.changed = true;

    await connection('files')
      .update({
        path: filename,
        originalname,
      })
      .where('id', id_file);
  }

  return next();
};
