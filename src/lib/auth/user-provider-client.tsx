'use client';

import type { User } from 'lucia';
import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';

const UserContext = createContext<User | null>(null);

export function useUser() {
	return useContext(UserContext);
}

export default function UserProvider({
	children,
	user,
}: {
	children: ReactNode;
	user: User | null;
}) {
	return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}
