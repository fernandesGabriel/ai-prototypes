import type { Static, TSchema as TypeSchema } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'

const Schema = Type

type SchemaType<T extends TypeSchema> = Static<T>

export { Schema, SchemaType }
