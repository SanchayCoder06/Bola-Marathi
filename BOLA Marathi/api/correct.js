export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = req.headers['x-personal-key'] || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Gemini API key is not configured on the server. Please enter a personal key in Settings.' });
  }

  const { sentence } = req.body;
  if (!sentence) {
    return res.status(400).json({ error: 'Sentence parameter is required.' });
  }

  try {
    const prompt = `You are an expert Marathi grammar coach helping English-speaking learners.
TASK: Assess the learner's written Marathi sentence. Correct any spelling or grammar errors. Explain the corrections simply in English, and suggest improvements.

LEARNER'S SENTENCE: ${sentence}

RESPOND with valid JSON in this exact format:
{
  "isCorrect": <boolean>,
  "corrected": "<corrected Marathi sentence or same sentence if correct>",
  "explanation": "<simple explanation of corrections made, or 'Looks perfect!' if correct>",
  "improvements": "<suggested alternative ways to say this in Marathi, or null>"
}`;

    const requestBody = {
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.2,
        topP: 0.85,
        maxOutputTokens: 1024,
        responseMimeType: 'application/json',
      },
    };

    const model = req.headers['x-gemini-model'] || 'gemini-1.5-flash';
    const version = req.headers['x-gemini-version'] || 'v1beta';

    const response = await fetch(`https://generativelanguage.googleapis.com/${version}/models/${model}:generateContent`, {
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
    console.error('Server correct error:', err);
    return res.status(500).json({ error: err.message });
  }
}
