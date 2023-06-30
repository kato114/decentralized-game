//////////////////////////////
//Error Types
/////////////////////////////

export class ValidationError extends Error {
    constructor(message) {
      super(message);
      this.name = "ValidationError";
    }
}

export class EntryNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "EntryNotFoundError";
  }
}

export class UserNotFoundError extends Error {
    constructor(message) {
      super(message);
      this.name = "UserNotFoundError";
    }
}