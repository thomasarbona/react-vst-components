import React, { useState } from 'react';
import { Meta } from '@storybook/react/types-6-0';
import { Story } from '@storybook/react';

import Knob, { KnobProps } from './Knob';

export default {
	title: 'Components/Knob',
	component: Knob,
} as Meta;

const Template: Story<KnobProps> = (args) => (
	<Knob {...args} onValueChange={undefined} />
);

const TemplateControlled: Story<KnobProps> = (args) => {
	const [value, setValue] = useState(50);

	return <Knob {...args} onValueChange={setValue} value={value} />;
};

export const Uncontrolled = Template.bind({});
Uncontrolled.args = {
	onValueChange: undefined,
};

export const Controlled = TemplateControlled.bind({});
Controlled.args = {
	minValue: 0,
	maxValue: 100,
};
