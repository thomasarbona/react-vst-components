import React, { useState } from 'react';

import { PointData } from '../lib/CurveFormula';

export type useHoverableComponentReturn = {
	isHovered: boolean;
	bind: {
		onMouseOver: (e: React.MouseEvent) => void;
		onMouseMove: (e: React.MouseEvent) => void;
		onMouseLeave: () => void;
	};
};

function useHoverableComponent(
	onMouseMoveHandler?: (distance: PointData, e: React.MouseEvent) => void,
): useHoverableComponentReturn {
	const [isHovered, setIsHovered] = useState(false);
	const [lastMousePos, setLastMousePos] = useState<PointData>([0, 0]);

	const handlePointerHover = (e: React.MouseEvent) => {
		setLastMousePos([e.clientX, e.clientY]);
		setIsHovered(true);
	};

	const handlePointerMove = (e: React.MouseEvent) => {
		if (!onMouseMoveHandler) {
			return;
		}

		const distance: PointData = [
			e.clientX - lastMousePos[0],
			e.clientY - lastMousePos[1],
		];

		setLastMousePos([e.clientX, e.clientY]);
		onMouseMoveHandler?.(distance, e);
	};

	const handlePointerLeave = () => {
		setIsHovered(false);
	};

	return {
		isHovered,
		bind: {
			onMouseOver: handlePointerHover,
			onMouseMove: handlePointerMove,
			onMouseLeave: handlePointerLeave,
		},
	};
}

export default useHoverableComponent;
