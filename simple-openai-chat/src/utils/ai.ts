import OpenAI from 'openai'

import { getEnvironment } from 'utils/env'

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

async function runCompletion(messages, model = 'gpt-3.5-turbo', temperature = 0): Promise<String> {
  const ai = getOpenAI()

  const completion = await ai.chat.completions.create({
    model,
    temperature,
    messages,
  })

  if (!completion.choices) {
    throw new Error('Unable to get completion choices.')
  }

  return completion.choices[0].message.content
}

export { getOpenAI, runCompletion }
