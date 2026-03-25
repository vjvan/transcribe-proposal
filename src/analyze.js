const SYSTEM_PROMPT = `You are an expert business consultant. Analyze a meeting transcript and extract structured proposal data.

Output a JSON object with this exact structure:
{
  "title": "Proposal title (concise, under 20 chars)",
  "subtitle": "One-line description of the proposal",
  "background": "1-2 paragraphs describing the client's situation and needs",
  "goals": ["goal 1", "goal 2", "goal 3", "goal 4"],
  "architecture": {
    "description": "Brief system architecture description",
    "flow": "Step-by-step data flow (use > as separator)",
    "tech_stack": [
      { "name": "Tech Name", "description": "What it does in the system" }
    ]
  },
  "features": [
    {
      "category": "Category Name",
      "items": ["feature 1", "feature 2"]
    }
  ],
  "pricing": {
    "plans": [
      {
        "name": "Plan A",
        "label": "Basic Plan Name",
        "total": 120000,
        "currency": "NT$",
        "recommended": false,
        "items": [
          { "name": "Item", "description": "What it includes", "price": 35000 }
        ],
        "summary": "Brief description of what this plan includes",
        "fit": "Who this plan is best for"
      }
    ]
  },
  "maintenance": [
    { "name": "Basic", "description": "What it covers", "price": "NT$ 3,000/mo" }
  ],
  "timeline": [
    { "phase": "Phase name", "content": "What gets done", "duration": "2-3 weeks" }
  ],
  "timeline_summary": "Total estimated timeline summary",
  "payment_terms": ["term 1", "term 2"],
  "payment_note": "Optional note about payment flexibility",
  "service_terms": ["term 1", "term 2"],
  "why_us": [
    { "title": "Strength", "description": "Why this matters" }
  ]
}

Rules:
- Extract actual details from the transcript. Do not make up information.
- If pricing was discussed, use those numbers. If not, provide reasonable estimates.
- Create 2 plans if possible: a basic one and a recommended full one.
- Feature categories should be 3-5 groups with 4-6 items each.
- Timeline should have 4-6 phases.
- All text should be in the same language as the transcript.
- Pricing items must sum to the plan total.`;

async function analyze(transcript, apiKey, model = 'gpt-4o-mini') {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Analyze this meeting transcript and extract a structured proposal:\n\n${transcript}` },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
      max_tokens: 4096,
    }),
    signal: AbortSignal.timeout(120000), // 2 min timeout
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(`OpenAI API error: ${err.error?.message || response.statusText}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;
  if (!content) throw new Error('Empty response from OpenAI API');

  const analysis = JSON.parse(content);

  // Validate required fields
  const required = ['title', 'subtitle', 'background', 'goals', 'features', 'pricing'];
  for (const field of required) {
    if (!analysis[field]) throw new Error(`Analysis missing required field: ${field}`);
  }

  return analysis;
}

module.exports = { analyze };
