import CustomAPIError from './custom-api.js';

class UnauthorizedError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}

export default UnauthorizedError; 