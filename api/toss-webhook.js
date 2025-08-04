import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const {
    student_id, name, birth, orderId, amount, discount, method, product
  } = req.body;

  // 인증 설정
  const auth = new JWT({
    email: process.env.GOOGLE_CLIENT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });

  const sheets = google.sheets({ version: 'v4', auth });

  const spreadsheetId = '1jAMVdKdUBvOdsiVInGJvNpgq3yBE98SYOCBMXSca8OA';
  const sheetName = 'Sheet1'; // 시트 탭 이름이 이거 맞는지 확인! (예: 시트1이면 수정)

  const now = new Date().toLocaleString('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A1`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[student_id, name, birth, orderId, amount, discount, method, product, now]],
      },
    });

    return res.status(200).json({ status: "success" });
  } catch (err) {
    console.error('❌ Sheets API Error:', err.message);
    return res.status(500).json({ status: "fail", error: err.message });
  }
}
