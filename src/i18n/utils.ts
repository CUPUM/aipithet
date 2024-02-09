import { Regconfig } from '@/database/constants';
import { headers } from 'next/headers';
import { REGCONFIG_HEADER_NAME } from './constants';

export function regconfig() {
	return headers().get(REGCONFIG_HEADER_NAME) as Regconfig;
}
