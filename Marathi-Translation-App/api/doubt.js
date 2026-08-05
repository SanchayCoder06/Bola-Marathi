export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = req.headers['x-personal-key'] || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Gemini API key is not configured on the server. Please enter a personal key in Settings.' });
  }

  const { question } = req.body;
  if (!question) {
    return res.status(400).json({ error: 'Question parameter is required.' });
  }

  try {
    const prompt = `You are an expert Marathi language tutor helping English-speaking learners.
TASK: Answer the learner's question about Marathi language, grammar, or vocabulary. Give a simple, clear explanation in English with examples where appropriate.

LEARNER'S QUESTION: ${question}

RESPOND with valid JSON in this exact format:
{
  "answer": "<simple explanation in English>",
  "examples": [
    {
      "marathi": "<Marathi phrase>",
      "transliteration": "<phonetic transliteration>",
      "english": "<English translation>"
    }
  ]
}`;

    const requestBody = {
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.3,
        topP: 0.85,
        maxOutputTokens: 1024,
        responseMimeType: 'application/json',
      },
    };

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: `Gemini API Error: ${errText}` });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error('Server doubt error:', err);
    return res.status(500).json({ error: err.message });
  }
}
