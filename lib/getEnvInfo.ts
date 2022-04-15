type Info = {
  name: string;
  id: string;
  main: string;
  proof: string;
};

const getEnvsInfo = (contents: string[]): Info[] => {
  return contents.map((content) => {
    // 環境名、ラベル名取得
    const name = content.match(/(?<=\\begin{).*(?=})/)[0];
    const id =
      content.search('\\label') != -1
        ? content.match(/(?<=\\label{).*(?=})/)!.at(0)
        : '';

    const [env, proofEnv] = content.split('%--');

    const main = env
      .replace(/\\begin{.*}/, '')
      .replace(`\\end{${name}}`, '')
      .replace(/\\label{.*}/, '');

    const proof =
      typeof proofEnv !== 'undefined'
        ? proofEnv.replace('\\begin{proof}', '').replace('\\end{proof}', '')
        : '';

    return {
      name: name,
      id: id,
      main: main,
      proof: proof,
    };
  });
};

export default getEnvsInfo;
