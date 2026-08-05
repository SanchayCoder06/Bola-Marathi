export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Gemini API key is not configured on the server. Please set the GEMINI_API_KEY environment variable in your Vercel Dashboard, or enter a personal API key in Settings.' });
  }

  const { word } = req.body;

  const prompt = `You are a professional Marathi-English-Hindi dictionary. Provide the translation, part of speech, transliteration, meanings, and a contextual example sentence for the searched word.
    
SEARCH WORD: "${word}"
    
INSTRUCTIONS:
1. If the searched word is in English or Hindi, translate it to Marathi and then provide the dictionary information for that Marathi word.
2. If the word is in Marathi, provide details directly.
3. Respond ONLY with valid JSON in this exact format:
{
  "word": "<Marathi word in Devanagari>",
  "transliteration": "<Latin phonetic pronunciation guide, e.g. namaskar>",
  "partOfSpeech": "<Noun / Verb / Adjective / Adverb / Phrase / Greeting>",
  "englishMeaning": "<Clear English definition/translation>",
  "hindiMeaning": "<Clear Hindi definition/translation in Devanagari>",
  "exampleMarathi": "<A natural, simple example sentence in Marathi Devanagari using this word>",
  "exampleEnglish": "<English translation of the example sentence>",
  "exampleHindi": "<Hindi translation of the example sentence in Devanagari>"
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
    console.error('Server dictionary error:', err);
    return res.status(500).json({ error: err.message });
  }
}
