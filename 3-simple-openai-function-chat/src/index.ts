import { Schema, SchemaType } from 'utils/schema'
import { formatToNaturalDate } from 'utils/date'
import { loadEnvironments } from 'utils/env'
import { logInfo } from 'utils/logger'
import { runFunctionCompletion } from 'utils/ai'

loadEnvironments()

const getCurrentWeatherParameters = Schema.Object({
  location: Schema.String({
    description: 'The city, state and country, e.g. San Francisco, CA, United States',
  }),
})

const getNDayWeatherForecastParameters = Schema.Object({
  location: Schema.String({
    description: 'The city, state and country, e.g. San Francisco, CA, United States',
  }),
  windowSize: Schema.Integer({
    description: 'The number of days to forecast, e.g. 5 for a 5-day forecast',
  }),
})

const functionCallbacks = {
  getCurrentWeather: ({ location }: SchemaType<typeof getCurrentWeatherParameters>): void => {
    logInfo(`Executing "getCurrentWeather('${location}')"`)
  },
  getNDayWeatherForecast: ({ location, windowSize }: SchemaType<typeof getNDayWeatherForecastParameters>): void => {
    logInfo(`Executing "getNDayWeatherForecast('${location}', ${windowSize})"`)
  },
  handleUnknownFunction: (): void => {
    logInfo('Executing "handleUnknownFunction()"')
  },
}

async function main() {
  const response = await runFunctionCompletion(
    [
      {
        role: 'system',
        content:
          "Don't make assumptions about what values to plug into functions. Ask for clarification if a user request is ambiguous. Precision is key!",
      },
      {
        role: 'assistant',
        content: `Today is ${formatToNaturalDate(new Date())}`,
      },
      {
        role: 'user',
        content: "What's the weather on Saturday in Oslo, Norway?.",
      },
    ],
    [
      {
        type: 'function',
        function: {
          name: functionCallbacks.getCurrentWeather.name,
          description: 'Get the current weather',
          parameters: getCurrentWeatherParameters,
        },
      },
      {
        type: 'function',
        function: {
          name: functionCallbacks.getNDayWeatherForecast.name,
          description: 'Get an N-day weather forecast',
          parameters: getNDayWeatherForecastParameters,
        },
      },
      {
        type: 'function',
        function: {
          name: functionCallbacks.handleUnknownFunction.name,
          description: 'Handle situations where the function needed is unknown, or inputs are ambiguous',
        },
      },
    ]
  )

  response.map((func: any) => {
    functionCallbacks[func.name](func.arguments)
  })
}

main()
