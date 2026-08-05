export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Gemini API key is not configured on the server. Please set the GEMINI_API_KEY environment variable in your Vercel Dashboard, or enter a personal API key in Settings.' });
  }

  const { text, direction } = req.body;

  const directionLabels = {
    'en_to_mr': { from: 'English', to: 'Marathi (Devanagari)' },
    'mr_to_en': { from: 'Marathi (Devanagari)', to: 'English' },
    'hi_to_mr': { from: 'Hindi', to: 'Marathi (Devanagari)' },
    'mr_to_hi': { from: 'Marathi (Devanagari)', to: 'Hindi' }
  };

  const dir = directionLabels[direction] || directionLabels['en_to_mr'];

  const prompt = `You are a professional translator specializing in Marathi, Hindi, and English.
    
TASK: Translate the following text from ${dir.from} to ${dir.to}.

TEXT TO TRANSLATE:
"${text}"

INSTRUCTIONS:
1. Provide a natural, culturally appropriate conversational translation.
2. If the target language is Marathi, provide a phonetic transliteration in English (Latin script) that helps a non-native speaker pronounce it.
3. Respond ONLY with valid JSON in this exact format:
{
  "translatedText": "<translated text>",
  "transliteration": "<phonetic pronunciation guide, or empty string if target is not Marathi>"
}`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 512,
          responseMimeType: 'application/json',
        }
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: `Gemini API Error: ${errText}` });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error('Server translate error:', err);
    return res.status(500).json({ error: err.message });
  }
}
