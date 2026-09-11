import { healthResponse } from '../chat-response';

export default function handler(_req: any, res: any) {
  return res.status(200).json(healthResponse());
}