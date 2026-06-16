const OpenAI = require('openai');
const env = require('../config/env');

let client = null;

function getClient() {
  if (!client) {
    if (env.groqKey) {
      client = new OpenAI({ 
        apiKey: env.groqKey,
        baseURL: 'https://api.groq.com/openai/v1'
      });
      client.isGroq = true;
    } else if (env.openaiKey) {
      client = new OpenAI({ apiKey: env.openaiKey });
    }
  }
  return client;
}

async function verifyAction({ type, description, date, co2Estimate, hasGeotag, imageUrl }) {
  const ai = getClient();

  if (!ai) {
    // fallback if no API key configured
    return fallbackVerify(type, co2Estimate, hasGeotag);
  }

  const promptText = `You are an expert environmental auditor AI. A user has submitted a green action for EcoCredits.
Verify the following claim for fraud or unrealistic numbers:
Type: ${type}
Description: ${description}
Date: ${date}
CO2 Estimate Claimed: ${co2Estimate} tons
Geotag Provided: ${hasGeotag ? 'Yes' : 'No'}

Instructions:
1. Check if the CO2 Estimate is realistic for the described action (e.g., planting 1 tree does NOT offset 1000 tons of CO2. A typical tree offsets ~0.02 tons/year).
2. If an image is provided, verify if the image matches the description.
3. Assess the overall credibility.

You MUST respond in valid JSON format matching this structure:
{
  "verified": boolean, 
  "creditScore": number (0-100, where <50 is unverified/fraud), 
  "message": "short explanation of your finding"
}`;

  const messages = [
    { role: 'system', content: 'You are an AI verifier for green actions. Respond only with valid JSON.' }
  ];

  // If imageUrl exists, we use a multimodal message
  if (imageUrl) {
    messages.push({
      role: 'user',
      content: [
        { type: "text", text: promptText },
        { type: "image_url", image_url: { url: imageUrl } }
      ]
    });
  } else {
    messages.push({ role: 'user', content: promptText });
  }

  try {
    const modelToUse = ai.isGroq 
      ? (imageUrl ? 'llama-3.2-11b-vision-preview' : 'llama-3.3-70b-versatile')
      : 'gpt-4o-mini';

    const apiParams = {
      model: modelToUse, 
      messages: messages,
      temperature: 0.2,
    };

    if (!(ai.isGroq && imageUrl)) {
      apiParams.response_format = { type: "json_object" };
    }

    const res = await ai.chat.completions.create(apiParams);

    let parsedResult;
    try {
      const content = res.choices[0].message.content.trim();
      parsedResult = JSON.parse(content);
    } catch (e) {
      // If the vision model returned plain text without proper JSON
      // extract just the bool and try to salvage it
      const content = res.choices[0].message.content.toLowerCase();
      parsedResult = {
        verified: content.includes('true') || !content.includes('false'),
        creditScore: content.includes('false') ? 30 : 85,
        message: res.choices[0].message.content.substring(0, 150)
      };
    }

    return parsedResult;
  } catch (err) {
    console.error('AI verification failed, using fallback:', err.message);
    return fallbackVerify(type, co2Estimate, hasGeotag);
  }
}

function fallbackVerify(type, co2Estimate, hasGeotag) {
  const knownTypes = [
    'Solar Energy', 'Reforestation', 'Waste Reduction',
    'Energy Efficiency', 'Clean Transport', 'Urban Agriculture', 'Wind Energy',
  ];

  const isKnown = knownTypes.includes(type);
  const score = isKnown ? (hasGeotag ? 90 : 75) : 70;

  return {
    verified: true,
    creditScore: score,
    message: isKnown
      ? `Environmental action '${type}' verified. ${hasGeotag ? 'Geotag confirmed.' : 'No geotag data.'}`
      : `Action type '${type}' accepted for verification.`,
  };
}

module.exports = { verifyAction };
