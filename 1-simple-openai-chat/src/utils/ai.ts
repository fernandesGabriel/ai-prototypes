import OpenAI from 'openai'

import { getEnvironment } from 'utils/env'

const defaultModel = 'gpt-3.5-turbo'

const defaultTemperature = 0

let client: OpenAI

function getOpenAI(): OpenAI {
  if (client) {
    return client
  }

  client = new OpenAI({
    apiKey: getEnvironment('OPENAI_API_KEY'),
  })

  return client
}

function buildCompletionOptions(options: { temperature?: number; model?: string }): {
  temperature: number
  model: string
} {
  if (!options) {
    options = {}
  }

  return {
    temperature: options.temperature || defaultTemperature,
    model: options.model || defaultModel,
  }
}

async function runCompletion(messages, options?: { temperature?: number; model?: string }): Promise<string | never> {
  const ai = getOpenAI()

  const completion = await ai.chat.completions.create({
    ...buildCompletionOptions(options),
    messages,
  })

  if (!completion.choices) {
    throw new Error('An error occurred while running the completion.')
  }

  return completion.choices[0].message.content
}

export { getOpenAI, runCompletion }
