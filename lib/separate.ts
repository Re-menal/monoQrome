import { PostType } from './types';

const separate = (contents: string): PostType => {
  // content を取り出す
  const sep = contents.split('\\begin{document}');
  const item = sep[1].replace('\\end{document}', '');
  // プリアンブルから情報を抜き出す
  const start = sep[0].indexOf('%##');
  const end = sep[0].lastIndexOf('%##');
  const info = sep[0].slice(start + 3, end);
  const data = info.split('%');

  return {
    slug: data[1].replace('slug:', '').trim(),
    id: data[2].replace('id:', '').trim(),
    title: data[3].replace('title:', '').trim(),
    date: data[4].replace('date:', '').trim(),
    content: item.trim(),
  };
};

export default separate;
