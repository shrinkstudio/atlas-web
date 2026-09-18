import { declareComponent } from '@webflow/react';
import Animation from '../animations/your-street';
import { AnimationCard } from '../shared/AnimationCard';

const YourStreet = () => (
  <AnimationCard width={320} height={201}>
    <Animation />
  </AnimationCard>
);

export default declareComponent(YourStreet, {
  name: 'Your Street',
  description: 'Posts from neighbors on the same street. Fits the box you give it; keeps text crisp by never upscaling.',
  group: 'Ruxlo',
  props: {},
});
