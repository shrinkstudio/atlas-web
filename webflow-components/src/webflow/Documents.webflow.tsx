import { declareComponent } from '@webflow/react';
import Animation from '../animations/documents';
import { AnimationCard } from '../shared/AnimationCard';

const Documents = () => (
  <AnimationCard width={320} height={221}>
    <Animation />
  </AnimationCard>
);

export default declareComponent(Documents, {
  name: 'Documents',
  description: 'Warranties and invoices filing themselves. Fits the box you give it; keeps text crisp by never upscaling.',
  group: 'Ruxlo',
  props: {},
});
