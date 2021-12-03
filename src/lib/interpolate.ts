import { PointData } from './CurveFormula';

const interpolate = (
	value: number,
	inputRange: PointData,
	outputRange: PointData,
): number => {
	const r = (value - inputRange[0]) / (inputRange[1] - inputRange[0]);
	return (outputRange[1] - outputRange[0]) * r + outputRange[0];
};

export default interpolate;
