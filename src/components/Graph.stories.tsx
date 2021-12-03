import React from 'react';
import { Meta } from '@storybook/react/types-6-0';
import { Story } from '@storybook/react';

import Graph, { GraphProps } from './Graph';

export default {
	title: 'Components/Graph',
	component: Graph,
} as Meta;

const Template: Story<GraphProps> = (args) => <Graph {...args} />;

export const Regular = Template.bind({});
Regular.args = {};
