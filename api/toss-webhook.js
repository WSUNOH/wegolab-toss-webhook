import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const {
    student_id, name, birth, orderId,
    amount, discount, method, product
  } = req.body;

  const scriptUrl = "https://script.google.com/macros/s/AKfycbzns17XGIq0yI4RVyvwqPvAfU4ZOnnspdFmCvBaPAomM8q_Y9YAX1TuhWMn77Trw1kf/exec";

  try {
    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        student_id,
        name,
        birth,
        orderId,
        amount,
        discount,
        method,
        product
      })
    });

    const text = await response.text();

    if (response.ok) {
      console.log("✅ Apps Script 응답:", text);
      return res.status(200).json({ status: 'success', scriptResponse: text });
    } else {
      console.error("❌ Apps Script 실패:", text);
      return res.status(500).json({ error: 'Script request failed', scriptResponse: text });
    }
  } catch (error) {
    console.error("❌ 서버 에러:", error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
