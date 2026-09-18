import { declareComponent } from '@webflow/react';
import Animation from '../animations/get-found';
import { AnimationCard } from '../shared/AnimationCard';

const GetFound = () => (
  <AnimationCard width={320} height={188}>
    <Animation />
  </AnimationCard>
);

export default declareComponent(GetFound, {
  name: 'Get Found',
  description: 'Homeowners finding the contractor nearby. Fits the box you give it; keeps text crisp by never upscaling.',
  group: 'Ruxlo',
  props: {},
});
