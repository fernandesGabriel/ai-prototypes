import path from 'node:path'
import fs from 'node:fs'

import dotenv from 'dotenv'

let isDotenvBooted = false

const envFilePaths = [path.resolve(__dirname, '../../.env.'), path.resolve(__dirname, '../../.env.global')]

function loadEnvironments(): void {
  envFilePaths.forEach((path) => {
    if (fs.existsSync(path)) {
      dotenv.config({ path })
    }
  })

  isDotenvBooted = true
}

function getEnvironment(key: keyof NodeJS.ProcessEnv): string {
  if (!isDotenvBooted) {
    throw new Error('You must call loadEnvironments before calling getEnvironment')
  }

  const value = process.env[key]

  if (!value) {
    throw new Error(`Missing environment variable: '${key}'`)
  }

  return value
}

export { loadEnvironments, getEnvironment }
