import { declareComponent } from '@webflow/react';
import Animation from '../animations/claim-work';
import { AnimationCard } from '../shared/AnimationCard';

const ClaimWork = () => (
  <AnimationCard width={320} height={204}>
    <Animation />
  </AnimationCard>
);

export default declareComponent(ClaimWork, {
  name: 'Claim Your Work',
  description: 'A contractor claiming a completed job. Fits the box you give it; keeps text crisp by never upscaling.',
  group: 'Ruxlo',
  props: {},
});
