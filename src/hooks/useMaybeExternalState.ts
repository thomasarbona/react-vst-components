import { useCallback, useEffect, useState } from 'react';

type SetValueArg<T> = T | ((v: T) => T);

function useMaybeExternalState<T>(
	valueInput: T,
	onValueChange?: (v: T) => void,
): [T, (f: SetValueArg<T>) => void] {
	const [value, setStateValue] = useState(valueInput);

	useEffect(() => {
		if (typeof valueInput !== 'undefined') {
			setStateValue(valueInput!);
		}
	}, [valueInput]);

	const setValue = useCallback(
		(updateValue) => {
			if (onValueChange) {
				onValueChange(
					updateValue instanceof Function ? updateValue(value) : updateValue,
				);
			} else {
				setStateValue((prevValue) =>
					updateValue instanceof Function
						? updateValue(prevValue)
						: updateValue,
				);
			}
		},
		[onValueChange, value],
	);

	return [value, setValue];
}

export default useMaybeExternalState;
