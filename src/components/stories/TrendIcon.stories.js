import TrendIcon from "../TrendIcon";

export default {
  title: "Trend Icon",
  component: TrendIcon,
};

const Template = (args, { argTypes }) => ({
  components: { TrendIcon },
  props: Object.keys(argTypes),
  template: '<trend-icon v-bind="$props" />',
});

export const TrendUp = Template.bind({});
TrendUp.args = {
  lastValue: "100",
  isIncr: 1,
};

export const TrendDown = Template.bind({});
TrendDown.args = {
  lastValue: "100",
  isIncr: -1,
};

export const TrendFlat = Template.bind({});
TrendFlat.args = {
  lastValue: "100",
  isIncr: 0,
};