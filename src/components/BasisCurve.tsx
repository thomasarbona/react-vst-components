import * as React from 'react';

import CurvePoint, { CurvePointProps, PointStyle } from './CurvePoint';
import { PointData } from '../lib/CurveFormula';

export interface CurveStyle {
	strokeWidth: number;
	stroke: string;
	fill: string;
}

export interface BasisCurveProps extends Partial<CurvePointProps> {
	id?: string;
	curveStyle?: Partial<CurveStyle>;
	pointStyle?: Partial<PointStyle>;
	points?: PointData[];
	path?: string;
	svgPathBind?: React.ComponentProps<'path'>;
	showPoints?: boolean;
	PointElement?: React.ElementType;
	hoverableStrokeWidth?: number;
	filledShape?: boolean;
}

const BasisCurve: React.FC<BasisCurveProps> = (props) => {
	const {
		id,
		points,
		path,
		PointElement = CurvePoint,
		showPoints = true,
		curveStyle: curveStyleProp,
		pointStyle,
		hoverableStrokeWidth,
		svgPathBind,
		...curvePointProps
	} = props;

	const curveStyle: CurveStyle = {
		strokeWidth: 1,
		stroke: '#E040FB',
		fill: 'none',
		...curveStyleProp,
	};

	const useLargerHoverable =
		hoverableStrokeWidth && hoverableStrokeWidth > curveStyle.strokeWidth;

	return (
		<>
			<path
				d={path}
				{...curveStyle}
				{...(useLargerHoverable ? {} : svgPathBind)}
			/>
			{showPoints &&
				points &&
				points.map((point, index) => (
					<PointElement
						curveId={id}
						position={point}
						index={index}
						key={index}
						pointStyle={pointStyle}
						{...curvePointProps}
					/>
				))}
			{useLargerHoverable && (
				<path
					d={path}
					stroke={'transparent'}
					strokeWidth={hoverableStrokeWidth}
					fill='none'
					{...svgPathBind}
				/>
			)}
		</>
	);
};

export default React.memo(BasisCurve);
