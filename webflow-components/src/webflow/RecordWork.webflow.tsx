import { declareComponent } from '@webflow/react';
import Animation from '../animations/record-work';
import { AnimationCard } from '../shared/AnimationCard';

const RecordWork = () => (
  <AnimationCard width={340} height={297}>
    <Animation />
  </AnimationCard>
);

export default declareComponent(RecordWork, {
  name: 'Record Work',
  description: 'Logging a job against the home record. Fits the box you give it; keeps text crisp by never upscaling.',
  group: 'Ruxlo',
  props: {},
});
