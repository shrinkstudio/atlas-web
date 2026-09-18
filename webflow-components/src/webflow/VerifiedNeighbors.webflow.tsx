import { declareComponent } from '@webflow/react';
import Animation from '../animations/verified-neighbors';
import { AnimationCard } from '../shared/AnimationCard';

const VerifiedNeighbors = () => (
  <AnimationCard width={320} height={252}>
    <Animation />
  </AnimationCard>
);

export default declareComponent(VerifiedNeighbors, {
  name: 'Verified Neighbors',
  description: 'Neighbors verifying who they are. Fits the box you give it; keeps text crisp by never upscaling.',
  group: 'Ruxlo',
  props: {},
});
