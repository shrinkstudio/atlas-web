import { declareComponent } from '@webflow/react';
import Animation from '../animations/work-history';
import { AnimationCard } from '../shared/AnimationCard';

const WorkHistory = () => (
  <AnimationCard width={320} height={267}>
    <Animation />
  </AnimationCard>
);

export default declareComponent(WorkHistory, {
  name: 'Work History',
  description: 'Jobs logging into a property timeline. Fits the box you give it; keeps text crisp by never upscaling.',
  group: 'Ruxlo',
  props: {},
});
