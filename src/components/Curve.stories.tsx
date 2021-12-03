import React from 'react';
import { Meta } from '@storybook/react/types-6-0';
import { Story } from '@storybook/react';

import Graph from './Graph';
import peak from '../lib/formulas/peak';
import Curve, { CurveProps } from './Curve';

export default {
	title: 'Components/Curve',
	component: Curve,
} as Meta;

const TemplateUncontrolled: Story<CurveProps> = (args) => (
	<Graph>
		<Curve {...args} />
	</Graph>
);

export const DefaultProps = TemplateUncontrolled.bind({});
DefaultProps.args = {};

export const Peak = TemplateUncontrolled.bind({});
Peak.args = {
	data: {
		...peak,
		parameters: {
			points: [[500, 100]],
			resonance: 38,
		},
	},
};
