import { LogoIcon } from './Icons';

export const Footer = () => {
  return (
    <footer id='footer'>
      <hr className='mx-auto w-11/12' />

      <section className='container mx-auto grid grid-cols-2 gap-x-12 gap-y-8 px-6 py-20 md:grid-cols-4 xl:grid-cols-6 2xl:max-w-screen-xl'>
        <div className='col-span-full xl:col-span-2'>
          <a rel='noreferrer noopener' href='/' className='flex text-xl font-bold'>
            <LogoIcon />
            ShadcnUI/React
          </a>
        </div>

        <div className='flex flex-col gap-2'>
          <h3 className='text-lg font-bold'>Follow US</h3>
          <div>
            <a rel='noreferrer noopener' href='#' className='opacity-60 hover:opacity-100'>
              Github
            </a>
          </div>

          <div>
            <a rel='noreferrer noopener' href='#' className='opacity-60 hover:opacity-100'>
              Twitter
            </a>
          </div>

          <div>
            <a rel='noreferrer noopener' href='#' className='opacity-60 hover:opacity-100'>
              Dribbble
            </a>
          </div>
        </div>

        <div className='flex flex-col gap-2'>
          <h3 className='text-lg font-bold'>Platforms</h3>
          <div>
            <a rel='noreferrer noopener' href='#' className='opacity-60 hover:opacity-100'>
              Web
            </a>
          </div>

          <div>
            <a rel='noreferrer noopener' href='#' className='opacity-60 hover:opacity-100'>
              Mobile
            </a>
          </div>

          <div>
            <a rel='noreferrer noopener' href='#' className='opacity-60 hover:opacity-100'>
              Desktop
            </a>
          </div>
        </div>

        <div className='flex flex-col gap-2'>
          <h3 className='text-lg font-bold'>About</h3>
          <div>
            <a rel='noreferrer noopener' href='#' className='opacity-60 hover:opacity-100'>
              Features
            </a>
          </div>

          <div>
            <a rel='noreferrer noopener' href='#' className='opacity-60 hover:opacity-100'>
              Pricing
            </a>
          </div>

          <div>
            <a rel='noreferrer noopener' href='#' className='opacity-60 hover:opacity-100'>
              FAQ
            </a>
          </div>
        </div>

        <div className='flex flex-col gap-2'>
          <h3 className='text-lg font-bold'>Community</h3>
          <div>
            <a rel='noreferrer noopener' href='#' className='opacity-60 hover:opacity-100'>
              Youtube
            </a>
          </div>

          <div>
            <a rel='noreferrer noopener' href='#' className='opacity-60 hover:opacity-100'>
              Discord
            </a>
          </div>

          <div>
            <a rel='noreferrer noopener' href='#' className='opacity-60 hover:opacity-100'>
              Twitch
            </a>
          </div>
        </div>
      </section>

      <section className='container pb-14 text-center'>
        <h3>
          &copy; 2024 Landing page made by{' '}
          <a
            rel='noreferrer noopener'
            target='_blank'
            href='https://www.linkedin.com/in/leopoldo-miranda/'
            className='text-primary border-primary transition-all hover:border-b-2'>
            Leo Miranda
          </a>
        </h3>
      </section>
    </footer>
  );
};
