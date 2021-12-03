import React from 'react';

interface Focus {
	id?: string;
	setFocusedId: (id: string) => void;
}

const FocusContext = React.createContext<Focus>({
	id: undefined,
	setFocusedId: () => {},
});

export default FocusContext;
