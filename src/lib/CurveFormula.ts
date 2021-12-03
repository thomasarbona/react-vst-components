import { GraphData } from '../contexts/GraphDataContext';
import { graphToSvgPoint } from './graphToSvgPosition';

export type PointData = [number, number];

export interface CurveParameters {
	points: PointData[];
	resonance: number;
}

export type CurveFormula = (x: number) => number;

export type CurveProcessor = (params: CurveParameters) => CurveFormula;

export interface CurveData {
	parameters: CurveParameters;
	processor: CurveProcessor;
}

// TODO: POO
export const processCurveFormula = (processor: CurveData): CurveFormula =>
	processor.processor(processor.parameters);

export const processCurveFormulas = (processors: CurveData[]): CurveFormula[] =>
	processors.map(processCurveFormula);

export const getSvgPathFromCurve = (
	curveFormula: CurveFormula,
	graphData: GraphData,
): string => {
	const path: string[] = [];

	for (let x = 0; x < graphData.canvasSize[0]; x += 1) {
		const p = graphToSvgPoint([x, curveFormula(x)], graphData);

		path.push(`${x === 0 ? 'M' : 'L'} ${p[0]}, ${p[1]}`);
	}

	return path.join(' ');
};

export const getSvgPathsFromMergedCurves = (
	curveFormulas: CurveFormula[],
	graphData: GraphData,
): { paths: string[]; mergedPath: string } => {
	const paths: string[][] = [];
	const mergedPath: string[] = [];

	for (let x = 0; x < graphData.canvasSize[0]; x += 1) {
		const ys = curveFormulas
			.map((formula, index) => {
				const y = formula(x);
				const p = graphToSvgPoint([x, y], graphData);

				if (!paths[index]) {
					paths[index] = [];
				}
				paths[index].push(`${x === 0 ? 'M' : 'L'} ${p[0]}, ${p[1]}`);

				return y;
			})
			.reduce((acc, y) => acc + y, 0);

		const p = graphToSvgPoint([x, ys], graphData);

		mergedPath.push(`${x === 0 ? 'M' : 'L'} ${p[0]}, ${p[1]}`);
	}
	return {
		paths: paths.map((path) => path.join(' ')),
		mergedPath: mergedPath.join(' '),
	};
};

export const mergeFormulas = (curveFormulas: CurveFormula[]): CurveFormula => (
	x,
) => curveFormulas.map((formula) => formula(x)).reduce((acc, y) => acc + y, 0);
