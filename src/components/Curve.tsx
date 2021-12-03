import React, { useCallback, useContext, useMemo, useState } from 'react';

import CurveControls from './CurveControls';
import CurvePoint from './CurvePoint';
import FocusContext from '../contexts/FocusContext';
import GraphDataContext from '../contexts/GraphDataContext';
import getUniqKey from '../lib/getUniqKey';
import peak from '../lib/formulas/peak';
import useMaybeExternalState from '../hooks/useMaybeExternalState';
import BasisCurve, { BasisCurveProps } from './BasisCurve';
import {
	CurveData,
	CurveFormula,
	PointData,
	getSvgPathFromCurve,
	processCurveFormula,
} from '../lib/CurveFormula';
import { svgToGraphPoint } from '../lib/graphToSvgPosition';

export interface CurveProps extends Partial<BasisCurveProps> {
	data?: CurveData;
	formula?: CurveFormula;
	onPointsChange?: (p: PointData[]) => void;
	onResonanceChange?: (r: number) => void;
	path?: string;
	id?: string;
	showControls?: boolean;
}

export const RESONANCE = { range: [0.025, 40] as PointData };

const Curve: React.FC<CurveProps> = (props) => {
	const graphDataCtx = useContext(GraphDataContext);
	const focusCtx = useContext(FocusContext);

	const {
		id: idProp = getUniqKey(),
		data = peak,
		formula,
		showControls = true,
		onPointsChange,
		onResonanceChange,
		path: pathProp,
		...basisCurveProps
	} = props;

	const [id] = useState(idProp);

	const [points, setPoints] = useMaybeExternalState<PointData[]>(
		data?.parameters?.points,
		onPointsChange,
	);

	const [resonance, setResonance] = useMaybeExternalState(
		data?.parameters?.resonance,
		onResonanceChange,
	);

	// point drag&drop
	const handlePointMouseMove = useCallback(
		(_, offset, e, r, index) => {
			setPoints((prevPoints) => {
				const newPoints = [...prevPoints];

				newPoints[index] = svgToGraphPoint(
					[
						e.clientX - (offset[0] - r) - graphDataCtx.canvasBoundingRect[0],
						e.clientY - (offset[1] - r) - graphDataCtx.canvasBoundingRect[1],
					],
					graphDataCtx,
				);
				return newPoints;
			});
		},
		[setPoints, graphDataCtx],
	);

	const renderControls = useCallback(() => {
		if (!id || id !== focusCtx.id || !showControls) {
			return null;
		}

		return (
			<foreignObject
				x={points[0][0]}
				y={graphDataCtx.canvasSize[1]}
				style={{ overflow: 'visible' }}
			>
				<CurveControls
					frequency={points[0][0]}
					gain={points[0][1]}
					q={resonance}
					onFrequencyChange={(frequency) =>
						setPoints((prevPoints) => {
							const newPoints = [...prevPoints];

							newPoints[0] = [frequency, newPoints[0][1]];
							return newPoints;
						})
					}
					onGainChange={(gain) =>
						setPoints((prevPoints) => {
							const newPoints = [...prevPoints];

							newPoints[0] = [newPoints[0][0], gain];
							return newPoints;
						})
					}
					onQChange={setResonance}
				/>
			</foreignObject>
		);
	}, [
		id,
		setPoints,
		focusCtx.id,
		graphDataCtx,
		showControls,
		points,
		resonance,
		setResonance,
	]);

	const path = useMemo(() => {
		if (pathProp) {
			return pathProp;
		}

		if (!formula && !data) {
			throw new Error(
				'<Curve>: no formula or processor given to calculate the curve',
			);
		}

		const _formula =
			formula ||
			processCurveFormula({
				processor: data.processor,
				parameters: {
					points,
					resonance,
				},
			});

		const newPath = getSvgPathFromCurve(_formula, graphDataCtx);

		return newPath;
	}, [data, formula, pathProp, points, graphDataCtx, resonance]);

	return (
		<>
			<BasisCurve
				id={id}
				path={path}
				points={points}
				onPointMouseMove={handlePointMouseMove}
				PointElement={CurvePoint}
				{...basisCurveProps}
			/>
			{renderControls()}
		</>
	);
};

export default Curve;
