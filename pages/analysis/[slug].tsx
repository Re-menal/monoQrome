import Head from 'next/head';
import Layout from '../../components/layout';
import Container from '../../components/container';
import PostHeader from '../../components/post-header';
import PostBody from '../../components/post-body';
import { getPostBySlug, getAllPosts } from '../../lib/api';
import { Category, PostType } from '../../lib/types';
import { SITE_NAME } from '../../lib/constants';

// カテゴリー名の設定
const CATEGORY_NAME: Category = 'analysis';
//

type Props = {
  post: PostType;
};

const Post = ({ post }: Props) => {
  return (
    <>
      <Layout>
        <Head>
          <title>
            {post.title} | {SITE_NAME}
          </title>
        </Head>
        <Container>
          <PostHeader id={post.id} title={post.title} date={post.date} />
          <PostBody id={post.id} content={post.content} />
        </Container>
      </Layout>
    </>
  );
};

export default Post;

/**** 
データ取得
****/
type Params = {
  params: {
    slug: string;
  };
};

export const getStaticProps = async ({ params }: Params) => {
  const post = getPostBySlug(params.slug, CATEGORY_NAME, [
    'slug',
    'id',
    'title',
    'date',
    'content',
  ]);

  return {
    props: {
      post: {
        ...post,
      },
    },
  };
};

export const getStaticPaths = async () => {
  const posts = getAllPosts(CATEGORY_NAME, ['slug']);
  // paths と fallback を返す
  return {
    paths: posts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      };
    }),
    fallback: false,
  };
};
