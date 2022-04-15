import type { NextPage } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import Layout from '../components/layout';
import Container from '../components/container';
import { SITE_NAME } from '../lib/constants';

const Home: NextPage = () => {
  return (
    <Layout>
      <Head>
        <title>{SITE_NAME}</title>
        <meta name='og:type' content='webpage' />
        <meta name='description' content='トップページ | monoQrome' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Container>
        <div className='flex justify-center content-center'>
          <h1 className='inline-block m-6 p-10 font-display tracking-tight text-6xl lg:text-8xl'>
            monoQrome
          </h1>
        </div>
        <div className='grid lg:grid-cols-2 place-content-center p-6'>
          <Link href='/analysis' passHref>
            <div className='top-page-box'>
              <a className='inline-block px-3 font-serif font-bold text-3xl border-l-4 border-l-cyan-500/50'>
                解析学 / Analysis
              </a>
              <p className='mt-4'>
                解析学についてのノートです。動機として関数を調べることを設定し、その視点からまとめています。
              </p>
            </div>
          </Link>

          <Link href='/' passHref>
            <div className='top-page-box'>
              <a className='inline-block px-3 font-serif font-bold text-3xl border-l-4 border-l-emerald-500/50'>
                微分幾何学 / Differential Geometry
              </a>
              <p className='mt-4'>微分幾何学についてのノートです。</p>
            </div>
          </Link>

          <Link href='/' passHref>
            <div className='top-page-box'>
              <a className='inline-block px-3 font-serif font-bold text-3xl border-l-4 border-l-rose-500/50'>
                可換環論 / Commutative Algebra
              </a>
              <p className='mt-4'>可換環論についてのノートです。</p>
            </div>
          </Link>

          <Link href='/' passHref>
            <div className='top-page-box'>
              <a className='inline-block px-3 font-serif font-bold text-3xl border-l-4 border-l-neutral-500/50'>
                抽象論 / Abstract Frameworks
              </a>
              <p className='mt-4'>
                多くの場所において様々な形で用いられる一般的な枠組みについての理論、具体的には位相空間論と線形代数の基本的な部分について整理したノートです。
              </p>
            </div>
          </Link>
        </div>
        <div className='flex justify-center'>
          <Link href='/about'>
            <a className='p-2 inline-block font-serif font-bold text-lg transition duration-200 hover:text-gray-500/50'>
              About
            </a>
          </Link>
        </div>
      </Container>
    </Layout>
  );
};

export default Home;
