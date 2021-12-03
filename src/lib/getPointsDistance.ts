import { PointData } from './CurveFormula';

const getPointsDistance = (p1: PointData, p2: PointData): number =>
	Math.sqrt((p2[0] - p1[0]) ** 2 + (p2[1] - p1[1]) ** 2);

export default getPointsDistance;
