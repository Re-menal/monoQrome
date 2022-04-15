import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

const Container = ({ children }: Props) => {
  return (
    <div className='lg:flex lg:justify-between'>
      <div className='invisible lg:visible lg:w-1/6' />
      <div className='mx-8 lg:w-4/6 xl:w-3/6'>{children}</div>
      <div className='invisible lg:visible lg:w-1/6' />
    </div>
  );
};

export default Container;
