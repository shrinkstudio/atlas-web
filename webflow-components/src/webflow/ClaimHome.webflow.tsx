import { declareComponent } from '@webflow/react';
import Animation from '../animations/claim-home';
import { AnimationCard } from '../shared/AnimationCard';

const ClaimHome = () => (
  <AnimationCard width={340} height={213}>
    <Animation />
  </AnimationCard>
);

export default declareComponent(ClaimHome, {
  name: 'Claim Your Home',
  description: 'A homeowner claiming their property profile. Fits the box you give it; keeps text crisp by never upscaling.',
  group: 'Ruxlo',
  props: {},
});
