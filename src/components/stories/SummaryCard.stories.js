import SummaryCard from "../SummaryCard";

export default {
    title: "Summary Card",
    compenent: SummaryCard
};

const Template = (args, {argTypes}) => ({
    components: {
        SummaryCard
    },
    props: Object.keys(argTypes),
    template: '<summary-card v-bind="$props" />'
});

export const Default = Template.bind({});
Default.args = {
    value: '100',
    lastValue: '99',
    description: 'Description',
    isIncr: 1,
}

export const Loading = Template.bind({});
Loading.args = {
    value: '100',
    lastValue: '99',
    description: 'Description',
    isIncr: 1,
    loading: true
}