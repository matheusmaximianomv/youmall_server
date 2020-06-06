import connection from '../../database';

class ProductController {
  async index(req, res) {
    const { id } = req.user;

    const products = await connection('products')
      .whereNot('id_owner', id)
      .where('stock', '>', 0);

    return res.status(200).json(products);
  }

  async store(req, res) {
    const { id: id_owner } = req.user;
    const { name, description, stock, price, size, id_type } = req.body;
    const id_file = req.file ? req.file.id_file : null;

    const [id_product] = await connection('products').insert({
      name,
      description,
      stock,
      price,
      size,
      id_type,
      id_owner,
      id_file,
    });

    const [product] = await connection('products')
      .where('id', id_product)
      .limit(1);

    return res.status(201).json(product);
  }

  async update(req, res) {
    const { id: id_user } = req.user;
    const { name, description, stock, price, size, id_type } = req.body;
    const { id: id_product } = req.params;

    const file = req.file ? req.file : null;
    let id_file;

    if (file.changed) {
      id_file = file.id_file;
    }

    const [product] = await connection('products').where('id', id_product);

    if (!product) {
      return res.status(400).json({ error: 'Product is not exist.' });
    }

    if (id_user !== product.id_owner) {
      return res
        .status(400)
        .json({ error: 'You are not allowed to change the product.' });
    }

    await connection('products')
      .update({
        name: name || product.name,
        description: description || product.description,
        stock: stock || product.stock,
        price: price || product.price,
        size: size || product.size,
        id_type: id_type || product.id_type,
        id_file: id_file || product.id_file,
      })
      .where('id', id_product);

    return res.status(204).json();
  }
}

export default new ProductController();
