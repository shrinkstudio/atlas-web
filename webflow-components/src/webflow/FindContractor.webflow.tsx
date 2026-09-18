import { declareComponent } from '@webflow/react';
import Animation from '../animations/find-contractor';
import { AnimationCard } from '../shared/AnimationCard';

const FindContractor = () => (
  <AnimationCard width={320} height={193}>
    <Animation />
  </AnimationCard>
);

export default declareComponent(FindContractor, {
  name: 'Find Contractor',
  description: 'Searching for a trusted local contractor. Fits the box you give it; keeps text crisp by never upscaling.',
  group: 'Ruxlo',
  props: {},
});
