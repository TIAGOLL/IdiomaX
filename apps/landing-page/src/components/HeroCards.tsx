import { Avatar, AvatarFallback, AvatarImage } from '@idiomax/ui/components/avatar';
import { Badge } from '@idiomax/ui/components/badge';
import { Button, buttonVariants } from '@idiomax/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@idiomax/ui/components/card';
import { Check, GithubIcon, Linkedin } from 'lucide-react';

import { LightBulbIcon } from './Icons';

export const HeroCards = () => {
  return (
    <div className='relative hidden h-[500px] w-[700px] flex-row flex-wrap gap-8 lg:flex'>
      {/* Testimonial */}
      <Card className='absolute -top-[15px] w-[340px] shadow-black/10 drop-shadow-xl dark:shadow-white/10'>
        <CardHeader className='flex flex-row items-center gap-4 pb-2'>
          <Avatar>
            <AvatarImage alt='' src='https://github.com/shadcn.png' />
            <AvatarFallback>SH</AvatarFallback>
          </Avatar>

          <div className='flex flex-col'>
            <CardTitle className='text-lg'>John Doe React</CardTitle>
            <CardDescription>@john_doe</CardDescription>
          </div>
        </CardHeader>

        <CardContent>This landing page is awesome!</CardContent>
      </Card>

      {/* Team */}
      <Card className='absolute top-4 right-[20px] flex w-80 flex-col items-center justify-center shadow-black/10 drop-shadow-xl dark:shadow-white/10'>
        <CardHeader className='mt-8 flex items-center justify-center pb-2'>
          <img
            src='https://i.pravatar.cc/150?img=58'
            alt='user avatar'
            className='absolute -top-12 aspect-square h-24 w-24 rounded-full object-cover grayscale-[0%]'
          />
          <CardTitle className='text-center'>Leo Miranda</CardTitle>
          <CardDescription className='text-primary font-normal'>Frontend Developer</CardDescription>
        </CardHeader>

        <CardContent className='pb-2 text-center'>
          <p>
            I really enjoy transforming ideas into functional software that exceeds expectations
          </p>
        </CardContent>

        <CardFooter>
          <div>
            <a
              rel='noreferrer noopener'
              href='https://github.com/leoMirandaa'
              target='_blank'
              className={buttonVariants({
                variant: 'ghost',
                size: 'sm',
              })}>
              <span className='sr-only'>Github icon</span>
              <GithubIcon className='h-5 w-5' />
            </a>
            <a
              rel='noreferrer noopener'
              href='https://twitter.com/leo_mirand4'
              target='_blank'
              className={buttonVariants({
                variant: 'ghost',
                size: 'sm',
              })}>
              <span className='sr-only'>X icon</span>
              <svg
                role='img'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
                className='fill-foreground h-5 w-5'>
                <title>X</title>
                <path d='M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z' />
              </svg>
            </a>

            <a
              rel='noreferrer noopener'
              href='https://www.linkedin.com/in/leopoldo-miranda/'
              target='_blank'
              className={buttonVariants({
                variant: 'ghost',
                size: 'sm',
              })}>
              <span className='sr-only'>Linkedin icon</span>
              <Linkedin size='20' />
            </a>
          </div>
        </CardFooter>
      </Card>

      {/* Pricing */}
      <Card className='absolute top-[150px] left-[50px] w-72 shadow-black/10 drop-shadow-xl dark:shadow-white/10'>
        <CardHeader>
          <CardTitle className='item-center flex justify-between'>
            Free
            <Badge variant='secondary' className='text-primary text-sm'>
              Most popular
            </Badge>
          </CardTitle>
          <div>
            <span className='text-3xl font-bold'>$0</span>
            <span className='text-muted-foreground'> /month</span>
          </div>

          <CardDescription>
            Lorem ipsum dolor sit, amet ipsum consectetur adipisicing elit.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Button className='w-full'>Start Free Trial</Button>
        </CardContent>

        <hr className='m-auto mb-4 w-4/5' />

        <CardFooter className='flex'>
          <div className='space-y-4'>
            {['4 Team member', '4 GB Storage', 'Upto 6 pages'].map((benefit: string) => (
              <span key={benefit} className='flex'>
                <Check className='text-green-500' /> <h3 className='ml-2'>{benefit}</h3>
              </span>
            ))}
          </div>
        </CardFooter>
      </Card>

      {/* Service */}
      <Card className='absolute -right-[10px] bottom-[35px] w-[350px] shadow-black/10 drop-shadow-xl dark:shadow-white/10'>
        <CardHeader className='flex items-start justify-start gap-4 space-y-1 md:flex-row'>
          <div className='bg-primary/20 mt-1 rounded-2xl p-1'>
            <LightBulbIcon />
          </div>
          <div>
            <CardTitle>Light & dark mode</CardTitle>
            <CardDescription className='text-md mt-2'>
              Lorem ipsum dolor sit amet consect adipisicing elit. Consectetur natusm.
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
};
