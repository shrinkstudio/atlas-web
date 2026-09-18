import { declareComponent } from '@webflow/react';
import Animation from '../animations/property-profile';
import { AnimationCard } from '../shared/AnimationCard';

const PropertyProfile = () => (
  <AnimationCard width={409} height={294}>
    <Animation />
  </AnimationCard>
);

export default declareComponent(PropertyProfile, {
  name: 'Property Profile',
  description: 'A property profile assembling itself. Fits the box you give it; keeps text crisp by never upscaling.',
  group: 'Ruxlo',
  props: {},
});
