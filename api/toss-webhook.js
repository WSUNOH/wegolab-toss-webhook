export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const {
    user_id,
    name,
    birth,
    orderId,
    amount,
    discount,
    method,
    product
  } = req.body;

  const accessToken = "YOUR_GOOGLE_SHEETS_ACCESS_TOKEN";
  const spreadsheetId = "YOUR_SPREADSHEET_ID";
  const sheetName = "결제기록"; // 원하는 시트 이름

  const now = new Date().toISOString();

  const values = [[user_id, name, birth, orderId, amount, discount, method, product, now]];

  const sheetsResponse = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${AMVdKdUBvOdsiVInGJvNpgq3yBE98SYOCBMXSca8OA}/values/${시트1}!A1:append?valueInputOption=USER_ENTERED`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ values })
    }
  );

  if (!sheetsResponse.ok) {
    const errorText = await sheetsResponse.text();
    return res.status(500).json({ error: "Failed to write to Google Sheets", detail: errorText });
  }

  return res.status(200).json({ status: "success" });
}
