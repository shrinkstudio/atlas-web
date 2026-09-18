import { declareComponent } from '@webflow/react';
import { props } from '@webflow/data-types';
import Animation from '../animations/who-its-for';
import { AnimationCard } from '../shared/AnimationCard';

const HeroWhoItsFor = ({ entrance = true, entranceDelay = 450 }: { entrance?: boolean; entranceDelay?: number }) => (
  <AnimationCard width={877} height={391} entrance={entrance} entranceDelay={entranceDelay}>
    <Animation />
  </AnimationCard>
);

export default declareComponent(HeroWhoItsFor, {
  name: 'Hero: Who It\'s For',
  description: 'The Who It\'s For page hero scene.',
  group: 'Ruxlo',
  props: {
    entrance: props.Boolean({ name: 'Entrance (page-load cadence)', defaultValue: true }),
    entranceDelay: props.Number({ name: 'Entrance delay (ms)', defaultValue: 450 }),
  },
});
