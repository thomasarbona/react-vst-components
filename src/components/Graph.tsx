import styled from 'styled-components';
import React, { ReactNode, useEffect, useRef, useState } from 'react';

import FocusContext from '../contexts/FocusContext';
import GraphDataContext, { GraphData } from '../contexts/GraphDataContext';
import { PointData } from '../lib/CurveFormula';

const DEFAULT_CANVAS_BORDER = 2;
const DEFAULT_CANVAS_SIZE: PointData = [1000, 500];
const DEFAULT_CANVAS_ORIGIN: PointData = [200, 0];

export interface GraphProps extends Partial<GraphData> {
	children?: ReactNode;
}

const Graph: React.FC<GraphProps> = (props) => {
	const [focusedId, setFocusedId] = useState<string>();
	const [canvasBoundingRect, setCanvasBoundingRect] = useState<PointData>([
		0,
		0,
	]);
	const svgCanvasRef = useRef<SVGSVGElement>(null);

	useEffect(() => {
		const boundingRect = svgCanvasRef.current?.getBoundingClientRect();
		if (boundingRect) {
			const canvasBoundingRect: PointData = [
				boundingRect.x + DEFAULT_CANVAS_BORDER,
				boundingRect.y + DEFAULT_CANVAS_BORDER,
			];
			setCanvasBoundingRect(canvasBoundingRect);
		}
	}, [svgCanvasRef]);

	const {
		canvasOrigin = DEFAULT_CANVAS_ORIGIN,
		canvasSize = DEFAULT_CANVAS_SIZE,
		children,
	} = props;

	return (
		<FocusContext.Provider value={{ id: focusedId, setFocusedId }}>
			<GraphDataContext.Provider
				value={{ canvasSize, canvasOrigin, canvasBoundingRect }}
			>
				<SvgCanvas
					ref={svgCanvasRef}
					width={canvasSize[0]}
					height={canvasSize[1]}
				>
					<line
						x1='0'
						y1={canvasOrigin[0]}
						x2={canvasSize[0]}
						y2={canvasOrigin[0]}
						stroke='#757575'
					/>

					{children}
				</SvgCanvas>
			</GraphDataContext.Provider>
		</FocusContext.Provider>
	);
};

const SvgCanvas = styled.svg`
	border: ${DEFAULT_CANVAS_BORDER}px solid black;
	position: relative;
	background-color: #212121;
`;

export default Graph;
