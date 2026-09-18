import { declareComponent } from '@webflow/react';
import Animation from '../animations/fragmented-tools';
import { AnimationCard } from '../shared/AnimationCard';

const FragmentedTools = () => (
  <AnimationCard width={380} height={434}>
    <Animation />
  </AnimationCard>
);

export default declareComponent(FragmentedTools, {
  name: 'Fragmented Tools',
  description: 'Scattered home-admin tools drifting apart. Fits the box you give it; keeps text crisp by never upscaling.',
  group: 'Ruxlo',
  props: {},
});
