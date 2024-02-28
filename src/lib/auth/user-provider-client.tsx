// auth/client.tsx
'use client';

import { type User } from 'lucia';
import { createContext, useContext, type ReactNode } from 'react';

const UserContext = createContext<User | null>(null);

export default function UserProvider({
	children,
	user,
}: {
	children: ReactNode;
	user: User | null;
}) {
	return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export function useUser() {
	return useContext(UserContext);
}
