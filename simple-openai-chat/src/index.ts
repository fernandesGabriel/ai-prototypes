import { runCompletion } from 'utils/ai'
import { loadEnvironments } from 'utils/env'
import { logInfo } from 'utils/logger'

loadEnvironments()

async function main() {
  const response = await runCompletion([
    {
      role: 'system',
      content: 'You will be provided with statements, and your task is to convert them to standard English.',
    },
    {
      role: 'user',
      content: 'She no went to the market.',
    },
  ])

  logInfo(response)
}

main()
