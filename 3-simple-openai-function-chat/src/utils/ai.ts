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

async function runFunctionCompletion<ContentType = object[]>(
  messages,
  tools,
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
    tools: tools,
    tool_choice: 'required',
  })

  if (!completion.choices) {
    throw new Error('An error occurred while running the completion.')
  }

  if (!completion.choices[0].message.tool_calls) {
    throw new Error('An error occurred while running the completion.')
  }

  let callbacks

  try {
    callbacks = completion.choices[0].message.tool_calls.map((callback) => {
      return {
        name: callback.function.name,
        arguments: JSON.parse(callback.function.arguments),
      }
    })
  } catch (error) {
    throw new Error('An error occurred while parsing the completion JSON.')
  }

  return callbacks
}

export { getOpenAI, runFunctionCompletion }
