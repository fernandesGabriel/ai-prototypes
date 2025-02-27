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

async function runCompletion<ContentType = object>(
  messages,
  options?: { temperature?: number; model?: string }
): Promise<ContentType | never> {
  const ai = getOpenAI()

  const systemMessages = [
    {
      role: 'system',
      content: 'You are a helpful assistant designed to output JSON.',
    },
  ]

  const completion = await ai.chat.completions.create({
    ...buildCompletionOptions(options),
    messages: [...systemMessages, ...messages],
    response_format: { type: 'json_object' },
  })

  if (!completion.choices) {
    throw new Error('An error occurred while running the completion.')
  }

  let json: ContentType

  try {
    json = JSON.parse(completion.choices[0].message.content)
  } catch (error) {
    throw new Error('An error occurred while parsing the completion JSON.')
  }

  return json
}

export { getOpenAI, runCompletion }
