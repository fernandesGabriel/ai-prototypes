import { runCompletion } from 'utils/ai'
import { loadEnvironments } from 'utils/env'
import { logInfo } from 'utils/logger'

loadEnvironments()

async function main() {
  const response = await runCompletion([{ role: 'user', content: 'List the biggest 5 countries in area.' }])

  logInfo(response)
}

main()
