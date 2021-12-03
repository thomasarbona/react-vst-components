import React, { useEffect, useRef, useState } from 'react';

import { PointData } from '../lib/CurveFormula';

export type useGrabbableComponentReturn<T> = {
	isActive: boolean;
	bind: {
		onPointerDown: (e: React.MouseEvent) => void;
		onPointerMove: (e: React.MouseEvent) => void;
		onPointerUp: (e: React.MouseEvent) => void;
		ref?: React.RefObject<T>;
	};
};

type useGrabbableComponentOptions = {
	initialGrabWithPointerId?: number;
	initialGrabOffset?: PointData;
};

function useGrabbableComponent<T>(
	{
		onMouseDown,
		onMouseUp,
		onMouseMove,
	}: {
		onMouseDown?: () => void;
		onMouseUp?: () => void;
		onMouseMove?: (
			distance: PointData,
			offset: PointData,
			e: React.MouseEvent,
			releaseFn: (e: React.MouseEvent) => void,
		) => void;
	},
	options: useGrabbableComponentOptions = {},
): useGrabbableComponentReturn<T> {
	const [isActive, setIsActive] = useState(false);
	const [lastMousePos, setLastMousePos] = useState<PointData>([0, 0]);
	const [offset, setOffset] = useState<PointData>(
		options.initialGrabOffset || [0, 0],
	);

	const componentRef = useRef<T>(null);

	useEffect(() => {
		if (options.initialGrabWithPointerId && componentRef.current) {
			setIsActive(true);
			onMouseDown?.();
			((componentRef.current as unknown) as HTMLElement).setPointerCapture(
				options.initialGrabWithPointerId,
			);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handlePointerDown = (e: React.MouseEvent) => {
		const el = e.currentTarget as HTMLElement;
		const boundingBox = el.getBoundingClientRect();
		const pointerId = ((e as unknown) as PointerEvent).pointerId;

		if (!el.hasPointerCapture(pointerId)) {
			el.setPointerCapture(pointerId);
		}
		setIsActive(true);
		setLastMousePos([e.clientX, e.clientY]);
		setOffset([e.clientX - boundingBox.x, e.clientY - boundingBox.y]);
		onMouseDown?.();
	};

	const handlePointerMove = (e: React.MouseEvent) => {
		if (isActive) {
			const distance: PointData = [
				e.clientX - lastMousePos[0],
				e.clientY - lastMousePos[1],
			];
			const mousePosition: PointData = [e.clientX, e.clientY];

			setLastMousePos(mousePosition);

			onMouseMove?.(distance, offset, e, handlePointerUp);
		}
	};

	const handlePointerUp = (e: React.MouseEvent) => {
		e.currentTarget.releasePointerCapture(
			((e as unknown) as PointerEvent).pointerId,
		);
		setIsActive(false);
		onMouseUp?.();
	};

	return {
		isActive,
		bind: {
			onPointerDown: handlePointerDown,
			onPointerMove: handlePointerMove,
			onPointerUp: handlePointerUp,
			ref: options.initialGrabWithPointerId ? componentRef : undefined,
		},
	};
}

export default useGrabbableComponent;
