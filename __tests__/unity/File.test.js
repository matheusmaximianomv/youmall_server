import { copyFile } from 'fs';
import { resolve } from 'path';
import { promisify } from 'util';
import File from '../../src/app/utils/File';

describe('Class util File', () => {
  test('Should return true when deleted an archive in repository', async () => {
    // Criando o arquivo no repository
    const path_original_file = resolve(
      __dirname,
      '..',
      'files',
      'roupas_A.jpg'
    );
    const path = 'teste_file_01.jpg';

    const error = await promisify(copyFile)(
      path_original_file,
      resolve(__dirname, '..', '..', 'tmp', 'uploads', 'products', path)
    );

    expect(error).toBe(undefined);

    // Utilizando a função para deletar
    const response = await File.delete(path);

    expect(response).toBe(true);
  });

  test('Should return false when not possible delete an archive in repository', async () => {
    const response = await File.delete('path_not_exist');

    expect(response).toBe(false);
  });
});
