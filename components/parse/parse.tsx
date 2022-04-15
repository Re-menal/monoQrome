import getEnvsInfo from '../../lib/getEnvInfo';
import InnerParse from './parse-inner';
import ProofParse from './parse-proof';

const getName = (name: string) => {
  switch (name) {
    case 'definition':
      return '定義';
    case 'theorem':
      return '定理';
    case 'proposition':
      return '命題';
    case 'lemma':
      return '補題';
    case 'proof':
      return '証明';
    case 'example':
      return '例';
    default:
      break;
  }
};

const getStyle = (name: string) => {
  switch (name) {
    case 'definition':
      return 'decoration-sky-500/30';
    case 'proposition':
      return 'decoration-pink-500/30';
    default:
      break;
  }
};

type TitleProps = {
  id: string;
  envName: string;
  section: string;
  index: number;
};

type ProofProps = {
  content: string;
};

type Props = {
  id: string;
  content: string;
};

const Title = ({ id, envName, section, index }: TitleProps) => {
  const style =
    'mb-3 py-1 font-serif font-extrabold text-xl inline-block underline decoration-2 underline-offset-2' +
    ' ' +
    getStyle(envName);

  return (
    <h2 id={id} className={style}>
      {getName(envName)} {section}.{String(index + 1)}
    </h2>
  );
};

const Proof = ({ content }: ProofProps) => {
  return content ? (
    <div className='pl-3 border-l-2'>
      <h3 className='font-extrabold'>証明</h3>
      <ProofParse content={content} isOutermost={true} />
    </div>
  ) : (
    <></>
  );
};

const Parse = (props: Props) => {
  const envs = props.content.split('%++');
  const envsInfo = getEnvsInfo(envs);

  return (
    <div className='divide-y-2'>
      {envsInfo.map((info, index) => (
        <div key={index} className='pt-6 pb-8 text-base leading-loose'>
          <Title
            id={info.id}
            envName={info.name}
            section={props.id}
            index={index}
          />
          <InnerParse content={info.main} />
          <Proof content={info.proof} />
        </div>
      ))}
    </div>
  );
};

export default Parse;
