import Link from 'next/link';
import Meta from './meta';

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <>
      <Meta />
      <div className='border-b-2'>
        <p className='px-6 py-2 inline-block font-display text-xl transition ease-in-out hover:-translate-y-0.5 duration-500 relative'>
          <Link href='/'>
            <a className='before:font-sans before:text-sm before:text-sky-500/50 before:content-["♥"] before:absolute before:left-4 before:-rotate-12 after:font-sans after:text-[.5rem] after:text-pink-500/50 after:content-["★"] after:absolute after:top-4 after:rotate-12'>
              monoQrome
            </a>
          </Link>
        </p>
      </div>
      <div>
        <main>{children}</main>
      </div>
    </>
  );
};

export default Layout;
