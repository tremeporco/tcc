import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth.js";

export const optionalAuth = async (req, res, next) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (session) {
      req.user = session.user;
      req.session = session.session;
    }

    next();

  } catch (error) {
    next();
  }
};