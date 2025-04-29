import { Button } from '@/components/ui/button';

export const Cta = () => {
  return (
    <section id='cta' className='bg-muted/50 my-24 py-16 sm:my-32'>
      <div className='container mx-auto place-items-center px-6 lg:grid lg:grid-cols-2 2xl:max-w-screen-xl'>
        <div className='lg:col-start-1'>
          <h2 className='text-3xl font-bold md:text-4xl'>
            All Your
            <span className='from-primary/60 to-primary bg-gradient-to-b bg-clip-text text-transparent'>
              {' '}
              Ideas & Concepts{' '}
            </span>
            In One Interface
          </h2>
          <p className='text-muted-foreground mt-4 mb-8 text-xl lg:mb-0'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque, beatae. Ipsa tempore
            ipsum iste quibusdam illum ducimus eos. Quasi, sed!
          </p>
        </div>

        <div className='space-y-4 lg:col-start-2'>
          <Button className='w-full md:mr-4 md:w-auto'>Request a Demo</Button>
          <Button variant='outline' className='w-full md:w-auto'>
            View all features
          </Button>
        </div>
      </div>
    </section>
  );
};
