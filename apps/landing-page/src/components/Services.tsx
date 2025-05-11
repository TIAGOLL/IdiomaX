import { Card, CardDescription, CardHeader, CardTitle } from '@idiomax/ui/components/card';
import type { JSX } from 'react';

import { ChartIcon, MagnifierIcon, WalletIcon } from './Icons';

interface ServiceProps {
  title: string;
  description: string;
  icon: JSX.Element;
}

const serviceList: ServiceProps[] = [
  {
    title: 'Code Collaboration',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi nesciunt est nostrum omnis ab sapiente.',
    icon: <ChartIcon />,
  },
  {
    title: 'Project Management',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi nesciunt est nostrum omnis ab sapiente.',
    icon: <WalletIcon />,
  },
  {
    title: 'Task Automation',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi nesciunt est nostrum omnis ab sapiente.',
    icon: <MagnifierIcon />,
  },
];

export const Services = () => {
  return (
    <section className='container mx-auto px-6 py-24 sm:py-32 2xl:max-w-screen-xl'>
      <div className='grid place-items-center gap-8 lg:grid-cols-[1fr,1fr]'>
        <div>
          <h2 className='text-3xl font-bold md:text-4xl'>
            <span className='from-primary/60 to-primary bg-gradient-to-b bg-clip-text text-transparent'>
              Client-Centric{' '}
            </span>
            Services
          </h2>

          <p className='text-muted-foreground mt-4 mb-8 text-xl'>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Veritatis dolor.
          </p>

          <div className='flex flex-col gap-8'>
            {serviceList.map(({ icon, title, description }: ServiceProps) => (
              <Card key={title}>
                <CardHeader className='flex items-start justify-start gap-4 space-y-1 md:flex-row'>
                  <div className='bg-primary/20 mt-1 rounded-2xl p-1'>{icon}</div>
                  <div>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription className='text-md mt-2'>{description}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        <img
          src={'/images/landing-page/cube-leg.png'}
          className='w-[300px] object-contain md:w-[500px] lg:w-[600px]'
          alt='About services'
        />
      </div>
    </section>
  );
};
