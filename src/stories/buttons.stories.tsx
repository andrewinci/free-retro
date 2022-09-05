import { ComponentStory, ComponentMeta } from "@storybook/react";
import {
  AddButton as AddButtonComponent,
  CloseButton as CloseButtonComponent,
} from "../app/components/buttons";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Example/Buttons",
  component: AddButtonComponent,
} as ComponentMeta<typeof AddButtonComponent>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const AddButtonTemplate: ComponentStory<typeof AddButtonComponent> = (args) => (
  <AddButtonComponent {...args} />
);

export const AddButton = AddButtonTemplate.bind({});

const CloseButtonTemplate: ComponentStory<typeof CloseButtonComponent> = (
  args
) => <CloseButtonComponent {...args} />;

export const CloseButton = CloseButtonTemplate.bind({});
