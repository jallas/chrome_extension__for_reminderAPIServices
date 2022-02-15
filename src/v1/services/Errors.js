const HttpStatusCode = {
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    INTERNAL_SERVER: 500,
  }
  
  class BaseError extends Error {
    constructor(name, code = 400, description, operational = true) {
      super(name)
      this.code = code;
      this.description = description;
      this.operational = operational;
    }
  }
  
  class NotFound extends BaseError {
    constructor(name = '', description = 'not found') {
      super(name, HttpStatusCode.NOT_FOUND, description);
    }
  }
  
  class BadRequest extends BaseError {
    constructor(name = '', description = 'bad request') {
      super(name, HttpStatusCode.BAD_REQUEST, description);
    }
  }
  
  class ServerError extends BaseError {
    constructor(name = '', description = 'server error') {
      super(name, HttpStatusCode.INTERNAL_SERVER, description);
    }
  }
  
  exports.BadRequest = BadRequest;
  exports.NotFound = NotFound;
  exports.ServerError = ServerError;
  exports.BaseError = BaseError;