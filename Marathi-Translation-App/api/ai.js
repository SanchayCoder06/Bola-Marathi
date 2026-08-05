export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = req.headers['x-personal-key'] || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Gemini API key is not configured on the server. Please enter a personal key in Settings.' });
  }

  const { sentence, question, type } = req.body;
  const isCorrection = type === 'correct' || !!sentence;

  try {
    let prompt = '';
    if (isCorrection) {
      const textToCorrect = sentence || question;
      prompt = `You are an expert Marathi grammar coach helping English-speaking learners.
TASK: Assess the learner's written Marathi sentence. Correct any spelling or grammar errors. Explain the corrections simply in English, and suggest improvements.

LEARNER'S SENTENCE: ${textToCorrect}

RESPOND with valid JSON in this exact format:
{
  "isCorrect": <boolean>,
  "corrected": "<corrected Marathi sentence or same sentence if correct>",
  "explanation": "<simple explanation of corrections made, or 'Looks perfect!' if correct>",
  "improvements": "<suggested alternative ways to say this in Marathi, or null>"
}`;
    } else {
      prompt = `You are an expert Marathi language tutor.
TASK: Answer the user's language doubt or question simply and clearly in English. Provide up to 2 high-quality examples with Marathi script, English translation, and transliteration.

USER QUESTION: ${question}

RESPOND with valid JSON in this exact format:
{
  "answer": "<simple explanation answering the user's question>",
  "examples": [
    {
      "marathi": "<example in Devanagari script>",
      "transliteration": "<English transliteration of example>",
      "english": "<English translation of example>"
    }
  ]
}`;
    }

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
    console.error('Server AI error:', err);
    return res.status(500).json({ error: err.message });
  }
}
