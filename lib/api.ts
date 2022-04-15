import fs from 'fs';
import path from 'path';
import separate from './separate';
import { PostType, Category, categoryToString } from './types';

type Field = keyof PostType;

// _posts のパス
// process.cwd() は Next.js が実行されているディレクトリを指す
const postsDirectory = path.join(process.cwd(), '_posts');

/**
 * 指定された slug を持つ記事の、指定されたフィールドの情報を返します。
 * @param slug 識別子名
 * @param category カテゴリー名
 * @param fields フィールド
 * @returns fields で指定されたデータの一覧
 */
export function getPostBySlug(
  slug: string,
  category: Category,
  fields: Field[] = []
) {
  // ファイル名から拡張子を取り除いて slug 名を取得
  const realSlug = slug.replace(/\.tex$/, '');
  const fullPath = path.join(
    postsDirectory,
    categoryToString(category),
    `${realSlug}.tex`
  );
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const contents = separate(fileContents);

  type Items = {
    [key in Field]?: string;
  };

  const items: Items = {};

  // フィールドごとに情報を格納
  fields.forEach((field) => {
    if (typeof contents[field] !== 'undefined') {
      items[field] = contents[field];
    }
  });

  return items;
}

/**
 * category を受け取り、そのカテゴリーに属する post の slug の一覧を返します。
 * @param category カテゴリー名
 * @return slug の一覧
 */
export function getPostSlugs(category: Category) {
  const dirPath = path.join(postsDirectory, category);
  return fs.readdirSync(dirPath);
}

/**
 * category と field を受け取り、 post の一覧を返します。
 * @param category カテゴリー名
 * @param fields フィールド
 * @return post の一覧
 */
export function getAllPosts(category: Category, fields: Field[] = []) {
  const slugs = getPostSlugs(category);
  const posts = slugs
    .map((slug) => getPostBySlug(slug, category, fields))
    // id の順番でソートする
    .sort((post1, post2) => (post1.id < post2.id ? -1 : 1));
  return posts;
}
