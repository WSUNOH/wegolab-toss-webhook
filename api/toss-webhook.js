import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const {
    name, birth, plan, orderId, amount, discount, method, product
  } = req.body;

  const auth = new JWT({
    email: process.env.GOOGLE_CLIENT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });

  const sheets = google.sheets({ version: 'v4', auth });

  const spreadsheetId = process.env.SHEET_ID;
  const sheetName = '시트1'; // 원하는 시트 이름

  const now = new Date().toISOString();

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${sheetname}!A1`,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[user_id, name, birth, orderId, amount, discount, method, product, now]],
    },
  });

  return res.status(200).json({ status: "success" });
}
