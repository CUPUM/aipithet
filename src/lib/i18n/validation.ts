import { z } from 'zod';
import type { AvailableLanguageTag } from './generated/runtime';
import { isAvailableLanguageTag } from './generated/runtime';

export const langSchema = z.custom<AvailableLanguageTag>((val) => isAvailableLanguageTag(val));
export type LangSchema = typeof langSchema;
