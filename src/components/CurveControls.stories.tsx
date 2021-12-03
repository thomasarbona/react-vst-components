import React from 'react';
import { Meta } from '@storybook/react/types-6-0';
import { Story } from '@storybook/react';

import CurveControls, { CurveControlsProps } from './CurveControls';

export default {
	title: 'Components/CurveControls',
	component: CurveControls,
} as Meta;

const Template: Story<CurveControlsProps> = (args) => (
	<CurveControls {...args} />
);

export const Regular = Template.bind({});
Regular.args = {};
