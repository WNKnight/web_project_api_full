const ERROR_INVALID_DATA = 400;
const ERROR_UNAUTHORIZED = 401;
const ERROR_FORBIDDEN = 403;
const ERROR_NOT_FOUND = 404;
const ERROR_DEFAULT = 500;

const handleInvalidData = (res, message) => {
  res.status(ERROR_INVALID_DATA).json({ message });
};

const handleUnauthorizedError = (res) => {
  res.status(ERROR_UNAUTHORIZED).json({ message: 'Autorização necessária' });
};

const handleNotFoundError = (res, message) => {
  res.status(ERROR_NOT_FOUND).json({ message });
};

const handleForbiddenError = (res, message) => {
  res.status(ERROR_FORBIDDEN).json({ message });
};

const handleDefaultError = (res) => {
  res.status(ERROR_DEFAULT).json({ message: 'Ocorreu um erro no servidor' });
};

module.exports = (err, req, res, next) => {
  if (err.statusCode === ERROR_INVALID_DATA) {
    return handleInvalidData(res, err.message || 'Dados fornecidos inválidos');
  }
  if (err.name === 'UnauthorizedError') {
    return handleUnauthorizedError(res);
  }
  if (err.statusCode === ERROR_FORBIDDEN) {
    return handleForbiddenError(res, err.message || 'Acesso proibido');
  }
  if (err.statusCode === ERROR_NOT_FOUND) {
    return handleNotFoundError(res, err.message || 'Recurso solicitado não encontrado');
  }
  handleDefaultError(res);
};
