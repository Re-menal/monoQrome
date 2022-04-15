import Parse from './parse/parse';
// import style from '../styles/components/PostBody.module.css';

type Props = {
  id: string;
  content: string;
};

const PostBody = ({ id, content }: Props) => {
  return (
    <div>
      <Parse id={id} content={content} />
    </div>
  );
};

export default PostBody;
