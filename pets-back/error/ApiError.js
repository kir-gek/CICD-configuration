class ApiError extends Error {
  constructor(status, message) {
    super();
    this.status = status;
    this.message = message;
  }

  static badRequest(message) {
    //статическая функия, к ней можно обращаться напрямую из класаа, не надо содавать объект (экземпляр класса)
    return new ApiError(404, message);
  }

  static internal(message) {
    return new ApiError(500, message);
  }
  static forbidden(message) {
    return new ApiError(403, message);
  }
}

module.exports = ApiError