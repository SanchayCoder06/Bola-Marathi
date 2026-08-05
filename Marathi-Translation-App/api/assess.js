export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Gemini API key is not configured on the server. Please set the GEMINI_API_KEY environment variable in your Vercel Dashboard, or enter a personal API key in Settings.' });
  }

  const { expectedMarathi, expectedTransliteration, expectedEnglish, userTranscription, audioBase64, audioMimeType } = req.body;

  try {
    const prompt = audioBase64
      ? `You are an expert Marathi language pronunciation coach helping English-speaking learners.

TASK: Listen to the attached audio recording and assess the learner's Marathi pronunciation against the expected phrase.

EXPECTED PHRASE:
- Marathi (Devanagari): ${expectedMarathi}
- Transliteration: ${expectedTransliteration}
- English meaning: ${expectedEnglish}
${userTranscription ? `\nAUTO-TRANSCRIPTION (may be imperfect): ${userTranscription}` : ''}

INSTRUCTIONS:
1. Listen carefully to the audio
2. Compare pronunciation, rhythm, and clarity to native Marathi
3. Identify specific sounds the learner got right or wrong

RESPOND with valid JSON in this exact format:
{
  "score": <number 0-100>,
  "accuracy": "<excellent|good|fair|poor>",
  "feedback": "<1-2 sentence constructive feedback in English>",
  "word_scores": [
    {
      "word": "<Marathi word>",
      "transliteration": "<transliteration>",
      "score": <number 0-100>,
      "tip": "<short pronunciation tip or null if good>"
    }
  ],
  "encouragement": "<short motivational message with emoji>"
}

SCORING GUIDE:
- 90-100 (excellent): Clear pronunciation, good rhythm, easily understood
- 70-89 (good): Mostly clear, minor accent issues
- 50-69 (fair): Understandable with effort, noticeable errors
- 0-49 (poor): Difficult to understand, needs significant practice

Be encouraging and constructive. Focus on actionable tips.`
      : `You are an expert Marathi language pronunciation coach helping English-speaking learners.

TASK: Assess the learner's spoken Marathi by comparing their transcription to the expected phrase.

EXPECTED PHRASE:
- Marathi (Devanagari): ${expectedMarathi}
- Transliteration: ${expectedTransliteration}  
- English meaning: ${expectedEnglish}

LEARNER'S TRANSCRIPTION: ${userTranscription || '(no transcription available)'}

RESPOND with valid JSON in this exact format:
{
  "score": <number 0-100>,
  "accuracy": "<excellent|good|fair|poor>",
  "feedback": "<1-2 sentence constructive feedback in English>",
  "word_scores": [
    {
      "word": "<Marathi word>",
      "transliteration": "<transliteration>",
      "score": <number 0-100>,
      "tip": "<short pronunciation tip or null if good>"
    }
  ],
  "encouragement": "<short motivational message with emoji>"
}

SCORING GUIDE:
- 90-100 (excellent): Near-perfect match, all words clear
- 70-89 (good): Most words correct, minor issues
- 50-69 (fair): Several errors but understandable
- 0-49 (poor): Significant difficulties, needs more practice

IMPORTANT:
- If no transcription is available, give a score of 50 with encouraging feedback to try again
- Focus on common English-speaker mistakes with Marathi sounds (retroflex consonants, nasalization, aspirated vs unaspirated)
- Be encouraging and constructive, never discouraging
- Keep tips practical and specific (e.g., "Touch your tongue to the roof of your mouth for ट")`;

    const requestBody = {
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.3,
        topP: 0.8,
        maxOutputTokens: 1024,
        responseMimeType: 'application/json',
      },
    };

    if (audioBase64) {
      requestBody.contents[0].parts.unshift({
        inlineData: {
          mimeType: audioMimeType || 'audio/webm',
          data: audioBase64,
        }
      });
    }

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
    console.error('Server assess error:', err);
    return res.status(500).json({ error: err.message });
  }
}
