// category の一覧
export type Category = 'analysis' | 'geometry' | 'misc';

export const categoryToString = (category: Category) => {
  switch (category) {
    case 'analysis':
      return 'analysis';
    case 'geometry':
      return 'geometry';
    case 'misc':
      return 'misc';
    default:
      return 'undefined';
  }
};

/**
 * slug : 識別子名
 * id : 節番号
 * title : タイトル
 * date : 日付
 * content : 内容
 */
export type PostType = {
  slug: string;
  id: string;
  title: string;
  date: string;
  content: string;
};
