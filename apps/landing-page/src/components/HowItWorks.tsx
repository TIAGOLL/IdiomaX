import { Card, CardContent, CardHeader, CardTitle } from '@idiomax/ui/components/card';
import type { JSX } from 'react';

import { GiftIcon, MapIcon, MedalIcon, PlaneIcon } from '../components/Icons';

interface FeatureProps {
  icon: JSX.Element;
  title: string;
  description: string;
}

const features: FeatureProps[] = [
  {
    icon: <MedalIcon />,
    title: 'Accessibility',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum quas provident cum',
  },
  {
    icon: <MapIcon />,
    title: 'Community',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum quas provident cum',
  },
  {
    icon: <PlaneIcon />,
    title: 'Scalability',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum quas provident cum',
  },
  {
    icon: <GiftIcon />,
    title: 'Gamification',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum quas provident cum',
  },
];

export const HowItWorks = () => {
  return (
    <section
      id='howItWorks'
      className='container mx-auto px-6 py-24 text-center sm:py-32 2xl:max-w-screen-xl'>
      <h2 className='text-3xl font-bold md:text-4xl'>
        How It{' '}
        <span className='from-primary/60 to-primary bg-gradient-to-b bg-clip-text text-transparent'>
          Works{' '}
        </span>
        Step-by-Step Guide
      </h2>
      <p className='text-muted-foreground mx-auto mb-8 mt-4 text-xl md:w-3/4'>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Veritatis dolor pariatur sit!
      </p>

      <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4'>
        {features.map(({ icon, title, description }: FeatureProps) => (
          <Card key={title} className='bg-muted/50'>
            <CardHeader>
              <CardTitle className='grid place-items-center gap-4'>
                {icon}
                {title}
              </CardTitle>
            </CardHeader>
            <CardContent>{description}</CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
