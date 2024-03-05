import { Tailwind } from '@react-email/components';
import type { ReactNode } from 'react';
import tailwindConfig from '../../../tailwind.config';

/**
 * Unfortunately react-email currently lacks seamless integration of css variables.-bottom-12.
 *
 * @see https://github.com/resend/react-email/issues/729
 */
export function Styles(props: { children: ReactNode }) {
	return <Tailwind config={tailwindConfig}>{props.children}</Tailwind>;
}
