const ERROR_INVALID_DATA = 400;
const ERROR_UNAUTHORIZED = 401;
const ERROR_FORBIDDEN = 403;
const ERROR_NOT_FOUND = 404;
const ERROR_DEFAULT = 500;

const handleInvalidData = (res, message) => {
  res.status(ERROR_INVALID_DATA).json({ message: message || 'Dados Invalidos' });
};

const handleUnauthorizedError = (res, message) => {
  res.status(ERROR_UNAUTHORIZED).json({ message: message || 'Autorização necessária' });
};

const handleForbiddenError = (res, message) => {
  res.status(ERROR_FORBIDDEN).json({ message: message || 'Acesso proibido' });
};

const handleNotFoundError = (res, message) => {
  res.status(ERROR_NOT_FOUND).json({ message: message || 'Recurso solicitado não encontrado' });
};

const handleDefaultError = (res, message) => {
  res.status(ERROR_DEFAULT).json({ message: message || 'Ocorreu um erro no servidor' });
};

module.exports = (err, req, res, next) => {
  if (err.statusCode === ERROR_INVALID_DATA) {
    return handleInvalidData(res, err.message);
  }
  if (err.statusCode === ERROR_UNAUTHORIZED) {
    return handleUnauthorizedError(res, err.message);
  }
  if (err.statusCode === ERROR_FORBIDDEN) {
    return handleForbiddenError(res, err.message);
  }
  if (err.statusCode === ERROR_NOT_FOUND) {
    return handleNotFoundError(res, err.message);
  }
  handleDefaultError(res, err.message);
};
