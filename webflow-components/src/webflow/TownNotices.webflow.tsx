import { declareComponent } from '@webflow/react';
import Animation from '../animations/town-notices';
import { AnimationCard } from '../shared/AnimationCard';

const TownNotices = () => (
  <AnimationCard width={320} height={201}>
    <Animation />
  </AnimationCard>
);

export default declareComponent(TownNotices, {
  name: 'Town Notices',
  description: 'Official town notices arriving on the board. Fits the box you give it; keeps text crisp by never upscaling.',
  group: 'Ruxlo',
  props: {},
});
