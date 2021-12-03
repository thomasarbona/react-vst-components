import React, { useCallback, useContext, useMemo, useState } from 'react';

import BasisCurve from './BasisCurve';
import Curve from './Curve';
import CurveControls from './CurveControls';
import CurvePoint from './CurvePoint';
import FocusContext from '../contexts/FocusContext';
import GraphDataContext from '../contexts/GraphDataContext';
import getPointsDistance from '../lib/getPointsDistance';
import getUniqKey from '../lib/getUniqKey';
import peak from '../lib/formulas/peak';
import useGrabbableComponent from '../hooks/useGrabbableComponent';
import useHoverableComponent from '../hooks/useHoverableComponent';
import useMaybeExternalState from '../hooks/useMaybeExternalState';
import {
	CurveData,
	CurveFormula,
	PointData,
	getSvgPathsFromMergedCurves,
	mergeFormulas,
	processCurveFormulas,
} from '../lib/CurveFormula';
import { svgToGraphPoint } from '../lib/graphToSvgPosition';

export interface CurveCollection {
	[id: string]: CurveData & {
		initialGrabWithPointerId?: number;
		initialGrabOffset?: PointData;
	};
}

export interface ComplexCurveProps {
	curves?: CurveCollection;
	formulas?: CurveFormula[];
}

const DEFAULT_CURVES = {};

const ComplexCurve: React.FC<ComplexCurveProps> = (props) => {
	const { curves: curvesProp = DEFAULT_CURVES, formulas } = props;

	const graphDataCtx = useContext(GraphDataContext);
	const focusCtx = useContext(FocusContext);

	const [curves, setCurves] = useMaybeExternalState<CurveCollection>(
		curvesProp,
	);

	const createNewCurve = (
		position: PointData,
		initialGrabOffset?: PointData,
		initialGrabWithPointerId?: number,
	) => {
		const newCurves = { ...curves };

		newCurves[getUniqKey()] = {
			...peak,
			parameters: {
				...peak.parameters,
				points: [[...position]],
			},
			initialGrabWithPointerId,
			initialGrabOffset,
		};

		setCurves(newCurves);
	};

	const [curveMousePosition, setCurveMousePosition] = useState<PointData>([
		0,
		0,
	]);

	const {
		isHovered: isCurveHovered,
		bind: hoverableBind,
	} = useHoverableComponent((_, e) => {
		const mouseBoundingRectPosition: PointData = [
			e.clientX - graphDataCtx.canvasBoundingRect[0],
			e.clientY - graphDataCtx.canvasBoundingRect[1],
		];

		setCurveMousePosition(
			svgToGraphPoint(mouseBoundingRectPosition, graphDataCtx),
		);
	});

	const { bind: grabbableBind } = useGrabbableComponent<SVGPathElement>({
		onMouseMove: (_, __, e, releaseFn) => {
			const mousePosition = svgToGraphPoint(
				[
					e.clientX - graphDataCtx.canvasBoundingRect[0],
					e.clientY - graphDataCtx.canvasBoundingRect[1],
				],
				graphDataCtx,
			);

			const distance = getPointsDistance(mousePosition, curveFlowingPointPos);

			if (distance > 10) {
				releaseFn(e);
				createNewCurve(
					[mousePosition[0], graphDataCtx.canvasOrigin[1]],
					// TODO: clean 20 (CurvePoint r)
					[20, graphDataCtx.canvasOrigin[1] - mousePosition[1] + 20],
					((e as unknown) as PointerEvent).pointerId,
				);
			}
		},
	});

	// point drag&drop
	const handlePointMouseMove = useCallback(
		(id, _, offset, e, r, index) => {
			const newCurves = { ...curves };

			newCurves[id].parameters.points[index] = svgToGraphPoint(
				[
					e.clientX - (offset[0] - r) - graphDataCtx.canvasBoundingRect[0],
					e.clientY - (offset[1] - r) - graphDataCtx.canvasBoundingRect[1],
				],
				graphDataCtx,
			);

			setCurves(newCurves);
		},
		[curves, graphDataCtx, setCurves],
	);

	const handlePointsChange = useCallback(
		(points: PointData[], id: string) => {
			const newCurves = { ...curves };
			newCurves[id].parameters.points = points;
			setCurves(newCurves);
		},
		[curves, setCurves],
	);

	const handleResonanceChange = useCallback(
		(resonance: number, id: string) => {
			const newCurves = { ...curves };
			newCurves[id].parameters.resonance = resonance;
			setCurves(newCurves);
		},
		[curves, setCurves],
	);

	const [stringPaths, mergedCurvesFn] = useMemo(
		() => [
			getSvgPathsFromMergedCurves(
				formulas || processCurveFormulas(Object.values(curves)),
				graphDataCtx,
			),
			mergeFormulas(formulas || processCurveFormulas(Object.values(curves))),
		],
		[formulas, curves, graphDataCtx],
	);

	const curveFlowingPointPos: PointData = useMemo(
		() => [curveMousePosition[0], mergedCurvesFn(curveMousePosition[0])],
		[curveMousePosition, mergedCurvesFn],
	);

	const renderControls = useCallback(() => {
		const curve = curves[focusCtx.id!] as CurveData | undefined;

		if (!curve) {
			return null;
		}

		const id = focusCtx.id!;

		return (
			<foreignObject
				x={curve.parameters.points[0][0]}
				y={graphDataCtx.canvasSize[1]}
				style={{ overflow: 'visible' }}
			>
				<CurveControls
					frequency={curve.parameters.points[0][0]}
					gain={curve.parameters.points[0][1]}
					q={curve.parameters.resonance}
					onFrequencyChange={(frequency) => {
						const points = [...curve.parameters.points];
						points[0] = [frequency, points[0][1]];
						handlePointsChange(points, id);
					}}
					onGainChange={(gain) => {
						const points = [...curve.parameters.points];
						points[0] = [points[0][0], gain];
						handlePointsChange(points, id);
					}}
					onQChange={(resonance) => handleResonanceChange(resonance, id)}
				/>
			</foreignObject>
		);
	}, [
		curves,
		focusCtx,
		graphDataCtx,
		handlePointsChange,
		handleResonanceChange,
	]);

	return (
		<>
			{Object.entries(curves).map(([id, curveConfig], index) => (
				<BasisCurve key={id} id={id} path={stringPaths.paths[index]} />
			))}
			<Curve
				path={stringPaths.mergedPath}
				points={isCurveHovered ? [curveFlowingPointPos] : []}
				curveStyle={{ stroke: '#00E676', strokeWidth: 3 }}
				pointStyle={{ fill: '#00E676' }}
				hoverableStrokeWidth={20}
				svgPathBind={{ ...hoverableBind, ...grabbableBind }}
			/>
			{Object.entries(curves).map(([id, curveConfig]) => (
				<CurvePoint
					key={id}
					curveId={id}
					position={curveConfig.parameters.points[0]}
					index={0}
					onPointMouseMove={(...args) => handlePointMouseMove(id, ...args)}
					initialGrabWithPointerId={curveConfig.initialGrabWithPointerId}
					initialGrabOffset={curveConfig.initialGrabOffset}
				/>
			))}
			{renderControls()}
		</>
	);
};

export default ComplexCurve;
