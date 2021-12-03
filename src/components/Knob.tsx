import styled from 'styled-components';
import React, { useMemo } from 'react';

import interpolate from '../lib/interpolate';
import useGrabbableComponent from '../hooks/useGrabbableComponent';
import useHoverableComponent from '../hooks/useHoverableComponent';
import useMaybeExternalState from '../hooks/useMaybeExternalState';
import { PointData } from '../lib/CurveFormula';

export interface KnobProps {
	defaultValue?: number;
	value?: number;
	minValue?: number;
	maxValue?: number;
	onValueChange?: (value: number) => void;
	size?: number;
	cursorShift?: number;
	restraint?: number;
	cursorExtremityShift?: number;
	className?: string;
}

const Knob: React.FC<KnobProps> = (props) => {
	const {
		defaultValue = 0,
		value: valueProp,
		minValue = 0,
		maxValue = 100,
		onValueChange,
		size = 100,
		cursorShift = 10,
		restraint = 200,
		cursorExtremityShift = Math.PI / 5,
		className,
	} = props;

	const [value, setValue] = useMaybeExternalState(
		isNaN(Number(valueProp)) ? defaultValue! : valueProp!,
		onValueChange,
	);

	const { isHovered, bind: hoverableBind } = useHoverableComponent();

	const { bind: grabbableBind } = useGrabbableComponent<SVGCircleElement>({
		onMouseMove: (distance) => {
			setValue((prevValue) => {
				const percent = -distance[1] / restraint;
				const add = (maxValue - minValue) * percent;
				return Math.max(minValue, Math.min(prevValue + add, maxValue));
			});
		},
	});

	const [r, cursorPosition] = useMemo(() => {
		const valueBoundaries: PointData = [
			0.5 * Math.PI + cursorExtremityShift,
			2.5 * Math.PI - cursorExtremityShift,
		];

		const r = size / 2;
		const cursorR = r - cursorShift;

		const mathValue = interpolate(value, [minValue, maxValue], valueBoundaries);

		const cursorX = r + cursorR * Math.cos(mathValue);
		const cursorY = r + cursorR * Math.sin(mathValue);

		return [r, [cursorX, cursorY]];
	}, [value, cursorExtremityShift, cursorShift, minValue, maxValue, size]);

	return (
		<KnobContainer className={className}>
			<svg style={{ overflow: 'visible' }} width={size} height={size}>
				<circle
					{...hoverableBind}
					{...grabbableBind}
					cx={r}
					cy={r}
					r={r}
					fill='white'
					stroke='black'
					strokeWidth='2'
				/>
				<circle
					cx={cursorPosition[0]}
					cy={cursorPosition[1]}
					r={isHovered ? 8 : 4}
					fill='black'
				/>
			</svg>
			<ValueLabel>{value.toFixed(2)}</ValueLabel>
		</KnobContainer>
	);
};

const KnobContainer = styled.div`
	text-align: center;
`;

const ValueLabel = styled.span`
	color: white;
	font-size: 12px;
	font-family: sans-serif;
`;

export default Knob;
