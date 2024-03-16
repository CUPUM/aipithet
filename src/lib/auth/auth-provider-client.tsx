'use client';

import type { Session, User } from 'lucia';
import type { ReactNode } from 'react';
import { createContext, useCallback, useContext } from 'react';
import type { PermissionKey } from './constants';
import { isAllowed } from './validation';

const AuthContext = createContext<{ user: User; session: Session } | { user: null; session: null }>(
	{ user: null, session: null }
);

export function useAuth() {
	return useContext(AuthContext);
}

export const AuthorizationContext = createContext<(key?: PermissionKey) => boolean>(() => false);

export function useAuthorization() {
	return useContext(AuthorizationContext);
}

export default function AuthProvider({
	children,
	auth,
}: {
	children: ReactNode;
	auth:
		| {
				user: User;
				session: Session;
		  }
		| {
				user: null;
				session: null;
		  };
}) {
	const authorize = useCallback(
		(key?: PermissionKey) => {
			if (!auth.user?.role) {
				return false;
			}
			return isAllowed(auth.user, key);
		},
		[auth.user]
	);
	return (
		<AuthContext.Provider value={auth}>
			<AuthorizationContext.Provider value={authorize}>{children}</AuthorizationContext.Provider>
		</AuthContext.Provider>
	);
}
