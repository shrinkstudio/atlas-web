import { declareComponent } from '@webflow/react';
import Animation from '../animations/confirm-work';
import { AnimationCard } from '../shared/AnimationCard';

const ConfirmWork = () => (
  <AnimationCard width={330} height={170}>
    <Animation />
  </AnimationCard>
);

export default declareComponent(ConfirmWork, {
  name: 'Confirm Work',
  description: 'Homeowner and contractor confirming a job. Fits the box you give it; keeps text crisp by never upscaling.',
  group: 'Ruxlo',
  props: {},
});
