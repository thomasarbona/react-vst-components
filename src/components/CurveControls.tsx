import styled from 'styled-components';
import React, { useContext } from 'react';

import GraphDataContext from '../contexts/GraphDataContext';
import Knob from './Knob';
import { RESONANCE } from './Curve';

export interface CurveControlsProps {
	frequency?: number;
	gain?: number;
	q?: number;
	onFrequencyChange?: (value: number) => void;
	onGainChange?: (value: number) => void;
	onQChange?: (value: number) => void;
}

const CurveControls: React.FC<CurveControlsProps> = (props) => {
	const graphDataCtx = useContext(GraphDataContext);

	const {
		frequency,
		gain,
		q,
		onFrequencyChange,
		onGainChange,
		onQChange,
	} = props;

	return (
		<CurveControlsContainer>
			<ControlKnob
				value={frequency}
				minValue={0}
				maxValue={graphDataCtx.canvasSize[0]}
				onValueChange={onFrequencyChange}
			/>
			<ControlKnob
				value={gain}
				minValue={-200}
				maxValue={200}
				onValueChange={onGainChange}
			/>
			<ControlKnob
				value={q}
				minValue={RESONANCE.range[0]}
				maxValue={RESONANCE.range[1]}
				onValueChange={onQChange}
			/>
		</CurveControlsContainer>
	);
};

const ControlKnob = styled(Knob)`
	margin-right: 8px;
`;

const CurveControlsContainer = styled.div`
	display: flex;
	flex-direction: row;
	position: absolute;
	background-color: #37474f;
	border-radius: 10px;
	box-shadow: 4px 4px 10px #212121;
	bottom: 8px;
	padding: 16px;
	padding-right: 8px;
`;

export default CurveControls;
