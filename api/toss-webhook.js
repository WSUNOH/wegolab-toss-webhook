import { google } from 'googleapis';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Only POST allowed');
  }
console.log('🔥 req.body:', req.body);
  const { user, method, totalAmount, discountAmount, paymentDate, plan_code } = req.body;

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SHEET_ID,
      range: '시트1!A:F', // 시트 이름 맞게 수정 가능
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[user, method, totalAmount, discountAmount, paymentDate, plan_code]],
      },
    });

    res.status(200).json({ message: '✅ Google Sheet updated' });
  } catch (err) {
    console.error('❌ Sheets API Error:', err);
    res.status(500).json({ error: 'Google Sheets API Error' });
  }
}

