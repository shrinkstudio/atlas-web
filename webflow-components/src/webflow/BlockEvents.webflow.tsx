import { declareComponent } from '@webflow/react';
import Animation from '../animations/block-events';
import { AnimationCard } from '../shared/AnimationCard';

const BlockEvents = () => (
  <AnimationCard width={320} height={171}>
    <Animation />
  </AnimationCard>
);

export default declareComponent(BlockEvents, {
  name: 'Block Events',
  description: 'A block event invitation going out. Fits the box you give it; keeps text crisp by never upscaling.',
  group: 'Ruxlo',
  props: {},
});
