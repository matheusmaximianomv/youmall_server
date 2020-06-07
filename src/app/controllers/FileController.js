import connection from '../../database';

class FileController {
  async show(req, res) {
    const { id } = req.params;

    const [file] = await connection('files').where('id', id).limit(1);

    if (!file) {
      return res.status(400).json({ error: 'File is not exist.' });
    }

    return res.status(200).json(file);
  }
}

export default new FileController();
