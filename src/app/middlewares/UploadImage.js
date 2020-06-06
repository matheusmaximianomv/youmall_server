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

    const [product] = await connection('products')
      .innerJoin('files', {
        id_file: 'file_id',
      })
      .where('product_id', id_product)
      .select(
        'files.path as path',
        'files.id as file_id',
        'products.id_file as id_file',
        'products.id as product_id'
      )
      .limit(1);

    if (!product) {
      return res.status(400).json({ error: 'Product is not exist.' });
    }

    const { path, id_file } = product;

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
