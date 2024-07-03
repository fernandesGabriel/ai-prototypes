import { runCompletion } from 'utils/ai'
import { loadEnvironments } from 'utils/env'
import { logInfo } from 'utils/logger'

loadEnvironments()

async function main() {
  const response = await runCompletion([
    {
      role: 'system',
      content: 'You will provided with a question, and you should answer succinctly.',
    },
    {
      role: 'user',
      content: 'What are the 5 biggest countries by area?',
    },
  ])

  logInfo(response)
}

main()
