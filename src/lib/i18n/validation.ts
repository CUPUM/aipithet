import { z } from 'zod';
import { AvailableLanguageTag, isAvailableLanguageTag } from './generated/runtime';

export const langSchema = z.custom<AvailableLanguageTag>((val) => isAvailableLanguageTag(val));
