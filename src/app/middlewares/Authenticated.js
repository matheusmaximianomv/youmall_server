import Token from '../lib/Token';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(400).json({ error: 'Token not provider.' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(400).json({ error: 'Badly formatted token.' });
  }

  try {
    const { id, isAdmin } = await Token.decoded(token);

    req.user = {
      id,
      isAdmin,
    };

    return next();
  } catch (error) {
    return res
      .status(401)
      .json({ error: 'Token Invalid.', description: error.name });
  }
};
