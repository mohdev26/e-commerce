import { HUserDocument } from "./DB/models/user.model.js";

declare global {
  namespace Express {
    interface Request {
      user?: HUserDocument;
    }
  }
}

export {};