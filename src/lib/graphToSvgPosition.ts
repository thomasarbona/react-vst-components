import { CurveData, PointData } from './CurveFormula';
import { GraphData } from '../contexts/GraphDataContext';

export const svgToGraphPoint = (
	svgPosition: PointData,
	graphData: GraphData,
): PointData => [
	svgPosition[0] - graphData.canvasOrigin[1],
	-svgPosition[1] + graphData.canvasOrigin[0],
];

export const graphToSvgPoint = (
	graphPosition: PointData,
	graphData: GraphData,
): PointData => [
	graphPosition[0] + graphData.canvasOrigin[1],
	-graphPosition[1] + graphData.canvasOrigin[0],
];

export const svgToGraphCurveData = (
	curveData: CurveData,
	graphData: GraphData,
): CurveData => {
	curveData.parameters.points = curveData.parameters.points.map((point) =>
		svgToGraphPoint(point, graphData),
	);

	return curveData;
};
