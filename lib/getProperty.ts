const findBracket = (content: string, start: number) => {
  let flag = -1;
  for (let i = start; i < content.length; i++) {
    if (content[i] == '{') {
      flag = 0;
    }
    if (content[i] == '}') {
      if (flag == 0) flag = 1;
      else return i;
    }
  }

  return -1;
};

/**
 * begin.location : 左側の位置
 * begin.str : 左側の内容
 * end.location : 右側の位置
 * end.str : 右側の内容
 * nextDepth : 再帰で呼び指す際、次に渡す深さの値
 * pairType : pairs で指定された文字列のうち何番目か
 */
export type pairProps = {
  begin: {
    location: number;
    str: string;
  };
  end: {
    location: number;
    str: string;
  };
  nextDepth: number;
  pairType?: boolean;
};

/**
 * 要素ペアの情報を記録します。
 * @param content データ
 * @param isNested ネストがあるかどうか
 * @param depth 深さ
 * @param bracket 括弧を考慮するかどうか
 * @param pairs 探す文字列の組
 * @returns pairProps[] 型の配列
 */
export const getPairProperty = (
  content: string,
  pairs: [string, string][],
  isNested?: boolean,
  depth?: number,
  bracket?: boolean
) => {
  let properties: pairProps[] = [];

  pairs.forEach((pair, index) => {
    const pairMatch = content.matchAll(new RegExp(pair[0], 'g'));

    for (const match of pairMatch) {
      const matchEnd = content
        .substring(match.index + 1)
        .match(new RegExp(pair[1]));

      const endLocation = bracket
        ? findBracket(content, match.index + match[0].length)
        : matchEnd.index + match.index;

      properties.push({
        begin: {
          location: match.index,
          str: match[0],
        },
        end: {
          location: endLocation,
          str: matchEnd[0],
        },
        nextDepth: isNested ? depth + 1 : 1,
        pairType: pairs.length > 1 ? !!index : undefined,
      });
    }
  });

  return properties;
};

/**
 * 環境の情報を記録します。
 * @param content データ
 * @param depth 深さ
 * @param envNames 環境名
 * @returns pairProps[] 型の配列
 */
export const getEnvProperty = (
  content: string,
  depth: number,
  ...envNames: string[]
) => {
  const nestPair: [string, string][] = envNames.map((name) => [
    `\\\\begin{${name}}%${depth}\n`,
    `\\\\end{${name}}%${depth}\n`,
  ]);

  const pair: [string, string][] = envNames.map((name) => [
    `\\\\begin{${name}}\n`,
    `\\\\end{${name}}\n`,
  ]);

  return getPairProperty(content, nestPair, true, depth)
    .concat(getPairProperty(content, pair, false, depth))
    .sort((pair1, pair2) =>
      pair1.begin.location < pair2.begin.location ? -1 : 1
    );
};

/**
 * 分離子の位置を記録します。
 * @param content データ
 * @param str 分離子名
 * @param avoid 避ける区間
 * @return number[] 型の配列
 */
export const getLocation = (
  content: string,
  str: string,
  avoid: { left: number; right: number }[]
) => {
  let avoidIndex = 0;
  let result: number[] = [];

  let skip = false;
  const par = content.matchAll(new RegExp(str, 'g'));
  for (const match of par) {
    if (avoid.length) {
      if (skip && avoid[avoidIndex].right < match.index) {
        skip = false;
        if (avoidIndex < avoid.length - 1) avoidIndex++;
      }
      // スキップのフラグ
      if (
        avoid[avoidIndex].left < match.index &&
        match.index < avoid[avoidIndex].right
      )
        skip = true;
    }
    if (!skip) result.push(match.index);
  }

  result.push(content.length);

  return result;
};
