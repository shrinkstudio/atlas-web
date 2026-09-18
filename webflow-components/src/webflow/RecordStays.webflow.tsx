import { declareComponent } from '@webflow/react';
import Animation from '../animations/record-stays';
import { AnimationCard } from '../shared/AnimationCard';

const RecordStays = () => (
  <AnimationCard width={340} height={222}>
    <Animation />
  </AnimationCard>
);

export default declareComponent(RecordStays, {
  name: 'Record Stays',
  description: 'The home record persisting across owners. Fits the box you give it; keeps text crisp by never upscaling.',
  group: 'Ruxlo',
  props: {},
});
