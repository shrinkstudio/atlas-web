import { declareComponent } from '@webflow/react';
import { props } from '@webflow/data-types';
import Animation from '../animations/hiw-hero';
import { AnimationCard } from '../shared/AnimationCard';

const HeroHowItWorks = ({ entrance = true, entranceDelay = 450 }: { entrance?: boolean; entranceDelay?: number }) => (
  <AnimationCard width={730} height={405} entrance={entrance} entranceDelay={entranceDelay}>
    <Animation />
  </AnimationCard>
);

export default declareComponent(HeroHowItWorks, {
  name: 'Hero: How It Works',
  description: 'The How It Works page hero scene.',
  group: 'Ruxlo',
  props: {
    entrance: props.Boolean({ name: 'Entrance (page-load cadence)', defaultValue: true }),
    entranceDelay: props.Number({ name: 'Entrance delay (ms)', defaultValue: 450 }),
  },
});
