import { RefObject, useEffect, useRef, useState } from 'react';

type useRefStateReturn<T> = [
	RefObject<T>,
	(newValue: T | ((v: T) => T)) => void,
	T,
];

function useRefState<T>(initialValue: T): useRefStateReturn<T> {
	const [state, setState] = useState(initialValue);
	const stateRef = useRef(state);

	useEffect(() => {
		stateRef.current = state;
	}, [state]);

	return [stateRef, setState, state];
}

export default useRefState;
