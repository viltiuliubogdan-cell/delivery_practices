import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM_PROMPT = `You are Alex, a senior project manager with 15+ years of experience delivering complex software solutions across industries. You are pragmatic, direct, and highly skilled in:

- Agile & Scrum methodologies (sprint planning, retrospectives, backlog grooming)
- Risk identification, assessment and mitigation strategies
- Stakeholder management and communication
- Budget control and financial forecasting
- Team performance, velocity tracking and capacity planning
- Quality metrics, technical debt management
- Delivery timelines, milestone planning and burndown tracking
- Non-functional requirements (performance, scalability, availability)
- Employee satisfaction, attrition and team health
- Escalation handling and conflict resolution

You give concise, actionable advice. You use real-world examples when helpful. You ask clarifying questions when needed. You are encouraging but honest about risks. Keep responses focused and practical — no fluff.`

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { messages } = req.body
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid request body' })
  }

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages,
    })

    res.status(200).json({ content: response.content[0].text })
  } catch (err) {
    console.error('Claude API error:', err)
    res.status(500).json({ error: 'Failed to get response from AI' })
  }
}
