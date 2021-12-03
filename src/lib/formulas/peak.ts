import interpolate from '../interpolate';
import { CurveData, PointData } from '../CurveFormula';
import { RESONANCE } from '../../components/Curve';
// TODO: clean RESONANCE (=> config?)

const peak: CurveData = {
	parameters: {
		points: [[0, 0]],
		resonance: 38,
	},
	processor: ({ points, resonance }) => {
		const C_RANGE = [500, 1.5] as PointData;
		const a = points[0]?.[1];
		const b = points[0]?.[0];
		const c = interpolate(resonance, RESONANCE.range, C_RANGE);

		return (x) => a * Math.exp(-((x - b) ** 2) / (2 * c ** 2));
	},
};

export default peak;
