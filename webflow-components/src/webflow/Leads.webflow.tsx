import { declareComponent } from '@webflow/react';
import Animation from '../animations/leads';
import { AnimationCard } from '../shared/AnimationCard';

const Leads = () => (
  <AnimationCard width={320} height={308}>
    <Animation />
  </AnimationCard>
);

export default declareComponent(Leads, {
  name: 'Get Leads',
  description: 'New leads streaming into the feed. Fits the box you give it; keeps text crisp by never upscaling.',
  group: 'Ruxlo',
  props: {},
});
