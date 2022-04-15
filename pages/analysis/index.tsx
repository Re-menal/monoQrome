import Link from 'next/link';
import Head from 'next/head';
import Layout from '../../components/layout';
import Container from '../../components/container';
import { getAllPosts } from '../../lib/api';
import { Category, PostType } from '../../lib/types';
import { SITE_NAME } from '../../lib/constants';

// カテゴリー名の設定
const CATEGORY_NAME: Category = 'analysis';

// 章の名前
const CHAPTER_NAMES = ['実数論'];

type Props = {
  allPosts: PostType[];
};

const Index = ({ allPosts }: Props) => {
  const chapters = CHAPTER_NAMES.map((name, chapterIndex) => {
    const chapterPosts = allPosts.filter(
      (post) => post.id.split('.').at(0) == String(chapterIndex + 1)
    );

    const sectionLinks = chapterPosts.map((post, sectionIndex) => (
      <Link
        key={sectionIndex}
        href='/analysis/[slug]'
        as={`/analysis/${post.slug}`}
      >
        <a className='text-lg transition duration-200 hover:text-gray-500/50'>
          {String(chapterIndex + 1) + '.' + String(sectionIndex + 1)}{' '}
          {post.title}
        </a>
      </Link>
    ));

    return (
      <div key={chapterIndex} className='font-serif font-bold'>
        <h2 className='mb-2 text-3xl'>
          {String(chapterIndex + 1) + '章'} {name}
        </h2>
        <div className='ml-4'>{sectionLinks}</div>
      </div>
    );
  });

  return (
    <>
      <Layout>
        <Head>
          <title>解析 | {SITE_NAME}</title>
        </Head>
        <Container>
          <h1 className='pt-10 pb-5 font-serif font-extrabold tracking-wider text-center text-5xl border-b-2 border-b-cyan-500/50'>
            解析学
          </h1>
          <div className='mt-8'>{chapters}</div>
        </Container>
      </Layout>
    </>
  );
};

export default Index;

export const getStaticProps = async () => {
  const allPosts = getAllPosts(CATEGORY_NAME, [
    'slug',
    'id',
    'title',
    'date',
    'content',
  ]);

  return {
    props: { allPosts },
  };
};
