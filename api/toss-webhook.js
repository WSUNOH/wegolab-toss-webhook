import { google } from 'googleapis';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Only POST requests allowed');
  }

  // 🔥 모든 요청 본문을 로깅
  console.log('🔥 Incoming Webhook Body:', req.body);

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // 📌 전송된 모든 필드를 받는다
    const {
      user_id,
      name,
      birth,
      orderId,
      amount,
      discount,
      method,
      product,
    } = req.body;

    // ✅ 구글 시트에 저장
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SHEET_ID,
      range: '시트1!A:H',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[user_id, name, birth, orderId, amount, discount, method, product]],
      },
    });

    res.status(200).json({ message: '✅ Google Sheet updated' });
  } catch (err) {
    console.error('❌ Google Sheets API Error:', err);
    res.status(500).json({ error: 'Google Sheets API Error', detail: err.message });
  }
}
