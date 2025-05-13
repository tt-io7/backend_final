import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
}; 