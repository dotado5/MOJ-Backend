import app from "../src/server";
import { VercelRequest, VercelResponse } from "@vercel/node";

export default (req: VercelRequest, res: VercelResponse) => {
  return app(req, res);
};
