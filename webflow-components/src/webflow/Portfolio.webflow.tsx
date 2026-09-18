import { declareComponent } from '@webflow/react';
import Animation from '../animations/portfolio';
import { AnimationCard } from '../shared/AnimationCard';

const Portfolio = () => (
  <AnimationCard width={320} height={221}>
    <Animation />
  </AnimationCard>
);

export default declareComponent(Portfolio, {
  name: 'Portfolio',
  description: 'A contractor portfolio building from real jobs. Fits the box you give it; keeps text crisp by never upscaling.',
  group: 'Ruxlo',
  props: {},
});
