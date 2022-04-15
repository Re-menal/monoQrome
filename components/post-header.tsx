type Props = {
  id: string;
  title: string;
  date: string;
};

const PostHeader = ({ id, title, date }: Props) => {
  return (
    <div className='my-8 '>
      <h1 className='text-3xl font-serif font-extrabold'>
        {id} {title}
      </h1>
      <p className='text-sm text-zinc-400 tracking-widest before:content-["↻"]'>
        {date}
      </p>
    </div>
  );
};

export default PostHeader;
