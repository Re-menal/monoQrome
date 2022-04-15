import Head from 'next/head';
import Layout from '../components/layout';
import Container from '../components/container';
import { SITE_NAME } from '../lib/constants';

const About = () => {
  return (
    <Layout>
      <Head>
        <title>About | {SITE_NAME}</title>
      </Head>
      <Container>
        <h1 className='pt-10 pb-5 font-serif font-extrabold tracking-wider text-center text-5xl border-b-2 border-b-stone-500/50'>
          ABOUT
        </h1>
        <div className='my-8'>
          <p>
            　数学について勉強したことをまとめています。誤りのないように心がけていますが、独習のため正確性の保証はできません。もし参考にする場合は自己責任でお願いします。
          </p>
          <p>
            　また、「考察」においては、ある内容に関して、 <b>主観的な</b>
            動機づけ、<b>個人的な</b>
            解釈、生じた疑問などを記しています。これらは執筆・更新時点での私の見解ですので、全く異なる内容に更新される可能性があります。できる限り鵜呑みにしないでください。
          </p>
        </div>
        <div className='my-8'>
          <p>
            執筆者： Re-menal ( Twitter : <a>@Re_menal2</a> )
          </p>
        </div>
      </Container>
    </Layout>
  );
};

export default About;
