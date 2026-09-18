import { declareComponent } from '@webflow/react';
import { props } from '@webflow/data-types';
import Animation from '../animations/home';
import { AnimationCard } from '../shared/AnimationCard';

const HeroOrbit = ({ entrance = true, entranceDelay = 450 }: { entrance?: boolean; entranceDelay?: number }) => (
  <AnimationCard selfSized entrance={entrance} entranceDelay={entranceDelay}>
    <Animation />
  </AnimationCard>
);

export default declareComponent(HeroOrbit, {
  name: 'Hero: Orbit Rings',
  description: 'Home page hero — the orbit rings scene. Sizes itself; give it a width.',
  group: 'Ruxlo',
  props: {
    entrance: props.Boolean({ name: 'Entrance (page-load cadence)', defaultValue: true }),
    entranceDelay: props.Number({ name: 'Entrance delay (ms)', defaultValue: 450 }),
  },
});
