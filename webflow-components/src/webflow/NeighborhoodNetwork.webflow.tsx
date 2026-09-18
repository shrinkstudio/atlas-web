import { declareComponent } from '@webflow/react';
import Animation from '../animations/neighborhood-network';
import { AnimationCard } from '../shared/AnimationCard';

const NeighborhoodNetwork = () => (
  <AnimationCard width={320} height={222}>
    <Animation />
  </AnimationCard>
);

export default declareComponent(NeighborhoodNetwork, {
  name: 'Neighborhood Network',
  description: 'Homes connecting across the neighborhood. Fits the box you give it; keeps text crisp by never upscaling.',
  group: 'Ruxlo',
  props: {},
});
