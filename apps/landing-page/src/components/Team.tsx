import { buttonVariants } from '@idiomax/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@idiomax/ui/components/card';
import { Facebook, Instagram, Linkedin } from 'lucide-react';

interface SociaNetworkslProps {
  name: string;
  url: string;
}

interface TeamProps {
  imageUrl: string;
  name: string;
  position: string;
  socialNetworks: SociaNetworkslProps[];
}

const teamList: TeamProps[] = [
  {
    imageUrl: 'https://i.pravatar.cc/150?img=35',
    name: 'Emma Smith',
    position: 'Product Manager',
    socialNetworks: [
      {
        name: 'Linkedin',
        url: 'https://www.linkedin.com/in/leopoldo-miranda/',
      },
      {
        name: 'Facebook',
        url: 'https://www.facebook.com/',
      },
      {
        name: 'Instagram',
        url: 'https://www.instagram.com/',
      },
    ],
  },
  {
    imageUrl: 'https://i.pravatar.cc/150?img=60',
    name: 'John Doe',
    position: 'Tech Lead',
    socialNetworks: [
      {
        name: 'Linkedin',
        url: 'https://www.linkedin.com/in/leopoldo-miranda/',
      },
      {
        name: 'Facebook',
        url: 'https://www.facebook.com/',
      },
      {
        name: 'Instagram',
        url: 'https://www.instagram.com/',
      },
    ],
  },
  {
    imageUrl: 'https://i.pravatar.cc/150?img=36',
    name: 'Ashley Ross',
    position: 'Frontend Developer',
    socialNetworks: [
      {
        name: 'Linkedin',
        url: 'https://www.linkedin.com/in/leopoldo-miranda/',
      },

      {
        name: 'Instagram',
        url: 'https://www.instagram.com/',
      },
    ],
  },
  {
    imageUrl: 'https://i.pravatar.cc/150?img=17',
    name: 'Bruce Rogers',
    position: 'Backend Developer',
    socialNetworks: [
      {
        name: 'Linkedin',
        url: 'https://www.linkedin.com/in/leopoldo-miranda/',
      },
      {
        name: 'Facebook',
        url: 'https://www.facebook.com/',
      },
    ],
  },
];

export const Team = () => {
  const socialIcon = (iconName: string) => {
    switch (iconName) {
      case 'Linkedin':
        return <Linkedin size='20' />;

      case 'Facebook':
        return <Facebook size='20' />;

      case 'Instagram':
        return <Instagram size='20' />;
    }
  };

  return (
    <section id='team' className='container mx-auto px-6 py-24 sm:py-32 2xl:max-w-screen-xl'>
      <h2 className='text-3xl font-bold md:text-4xl'>
        <span className='from-primary/60 to-primary bg-gradient-to-b bg-clip-text text-transparent'>
          Our Dedicated{' '}
        </span>
        Crew
      </h2>

      <p className='text-muted-foreground mb-10 mt-4 text-xl'>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Veritatis dolor pariatur sit!
      </p>

      <div className='grid gap-8 gap-y-10 md:grid-cols-2 lg:grid-cols-4'>
        {teamList.map(({ imageUrl, name, position, socialNetworks }: TeamProps) => (
          <Card
            key={name}
            className='bg-muted/50 relative mt-8 flex flex-col items-center justify-center'>
            <CardHeader className='mt-8 flex items-center justify-center pb-2'>
              <img
                src={imageUrl}
                alt={`${name} ${position}`}
                className='absolute -top-12 aspect-square h-24 w-24 rounded-full object-cover'
              />
              <CardTitle className='text-center'>{name}</CardTitle>
              <CardDescription className='text-primary'>{position}</CardDescription>
            </CardHeader>

            <CardContent className='pb-2 text-center'>
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
            </CardContent>

            <CardFooter>
              {socialNetworks.map(({ name, url }: SociaNetworkslProps) => (
                <div key={name}>
                  <a
                    rel='noreferrer noopener'
                    href={url}
                    target='_blank'
                    className={buttonVariants({
                      variant: 'ghost',
                      size: 'sm',
                    })}>
                    <span className='sr-only'>{name} icon</span>
                    {socialIcon(name)}
                  </a>
                </div>
              ))}
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};
