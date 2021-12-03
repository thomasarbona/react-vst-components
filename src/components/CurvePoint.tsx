import React, { useContext, useMemo } from 'react';

import FocusContext from '../contexts/FocusContext';
import GraphDataContext from '../contexts/GraphDataContext';
import useGrabbableComponent from '../hooks/useGrabbableComponent';
import useHoverableComponent from '../hooks/useHoverableComponent';
import { PointData } from '../lib/CurveFormula';
import { graphToSvgPoint } from '../lib/graphToSvgPosition';

export type PointPositionChangeFunc = (position: PointData, i: number) => void;

export interface PointStyle {
	stroke: string;
	strokeWidth: number;
	fill: string;
}

export interface CurvePointProps {
	curveId?: string;
	position: PointData;
	onPointMouseDown?: (i: number) => void;
	onPointMouseUp?: (i: number) => void;
	onPointMouseMove?: (
		distance: PointData,
		offset: PointData,
		e: React.MouseEvent,
		r: number,
		i: number,
	) => void;
	pointStyle?: Partial<PointStyle>;
	index: number;
	initialGrabWithPointerId?: number;
	initialGrabOffset?: PointData;
}

const CurvePoint: React.FC<CurvePointProps> = (props) => {
	const graphDataCtx = useContext(GraphDataContext);
	const focusCtx = useContext(FocusContext);

	const {
		position,
		onPointMouseDown,
		onPointMouseMove,
		onPointMouseUp,
		curveId,
		index,
		pointStyle: pointStyleProp,
		initialGrabWithPointerId,
		initialGrabOffset,
	} = props;

	const pointStyle: PointStyle = {
		stroke: 'black',
		strokeWidth: 0,
		fill: '#E040FB',
		...pointStyleProp,
	};

	const { isHovered, bind: hoverableBind } = useHoverableComponent();

	const r = isHovered ? 20 : 10;

	const { bind: grabbableBind } = useGrabbableComponent<SVGCircleElement>(
		{
			onMouseDown: () => {
				if (curveId) {
					focusCtx.setFocusedId(curveId);
				}
				onPointMouseDown?.(index);
			},
			onMouseUp: () => {
				onPointMouseUp?.(index);
			},
			onMouseMove: (distance, offset, e) => {
				onPointMouseMove?.(distance, offset, e, r, index);
			},
		},
		{ initialGrabWithPointerId, initialGrabOffset },
	);

	const svgPosition = useMemo(() => graphToSvgPoint(position, graphDataCtx), [
		position,
		graphDataCtx,
	]);

	return (
		<circle
			{...hoverableBind}
			{...grabbableBind}
			cx={svgPosition[0]}
			cy={svgPosition[1]}
			r={r}
			{...pointStyle}
		/>
	);
};

export default CurvePoint;
