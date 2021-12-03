import React from 'react';
import { Meta } from '@storybook/react/types-6-0';
import { Story } from '@storybook/react';

import Graph from './Graph';
import ComplexCurve, { ComplexCurveProps } from './ComplexCurve';

export default {
	title: 'Components/ComplexCurve',
	component: ComplexCurve,
} as Meta;

const Template: Story<ComplexCurveProps> = (args) => (
	<Graph>
		<ComplexCurve {...args} />
	</Graph>
);

export const DefaultProps = Template.bind({});
DefaultProps.args = {};
