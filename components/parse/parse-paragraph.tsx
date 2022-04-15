import React from 'react';
import katex from 'katex';
import {
  pairProps,
  getPairProperty,
  getEnvProperty,
} from '../../lib/getProperty';
import { getContents } from '../../lib/getContents';

const macros: { [key in string]: string } = {
  '\\cl': '\\overline{#1}',
  '\\ve': '\\varepsilon',
  '\\dps': '\\displaystyle',
};

type Props = {
  content: string;
};

/**
 * インライン数式をパースします。
 * @return span 要素の列を内側に含む Fragment
 */
const InlineParse = ({ content }: Props) => {
  // 左の $ と右の $ のペアの位置の記録
  let inlineLocation: pairProps[] = [];
  for (let i = 0; i < content.length; i++) {
    if (content[i] == '$') {
      for (let j = i + 1; j < content.length; j++) {
        if (content[j] == '$') {
          inlineLocation.push({
            begin: {
              location: i,
              str: '$',
            },
            end: {
              location: j,
              str: '$',
            },
            nextDepth: 1,
          });
          i = j + 1;
          break;
        }
      }
    }
  }

  const results = getContents(content, inlineLocation);

  return (
    <>
      {results.map((result, index) =>
        result.isFocused ? (
          <span
            key={index}
            dangerouslySetInnerHTML={{
              __html: katex.renderToString(result.content, {
                macros: macros,
              }),
            }}
          />
        ) : (
          <span key={index}>{result.content}</span>
        )
      )}
    </>
  );
};

/**
 * \textbf{} をパースします。
 * @return b 要素 or Fragment
 */
const TextbfParse = ({ content }: Props) => {
  const textbfLocation = getPairProperty(
    content,
    [['\\\\textbf{', '}']],
    false,
    0,
    true
  );

  const results = getContents(content, textbfLocation);

  return (
    <>
      {results.map((result, index) =>
        result.isFocused ? (
          <b key={index}>
            <InlineParse content={result.content} />
          </b>
        ) : (
          <InlineParse key={index} content={result.content} />
        )
      )}
    </>
  );
};

/**
 * 1 つの段落をパースします。特に、 align 環境を変換します。
 * @return span 要素 or Fragment
 */
const SentenceParse = ({ content }: Props) => {
  const alignProperty = getEnvProperty(content, 0, 'align', 'align\\*');

  // 数式の場合、結果は \begin{align}, \end{align} を含んでいてほしいから isConteinEnvName に true を指定する
  const results = getContents(content, alignProperty, true);

  return (
    <>
      {results.map((result, index) =>
        result.isFocused ? (
          <span
            key={index}
            dangerouslySetInnerHTML={{
              __html: katex.renderToString(result.content, {
                displayMode: true,
              }),
            }}
          />
        ) : (
          <TextbfParse key={index} content={result.content} />
        )
      )}
    </>
  );
};

/**
 * 複数の段落からなる文章をパースします。
 * @return p 要素の列を内側に含む Fragment
 */
const ParagraphParse = ({ content }: Props) => {
  return (
    <>
      {content.split('\\par\n').map((paragraph, index) => (
        <p key={index}>
          <SentenceParse content={paragraph} />
        </p>
      ))}
    </>
  );
};

export default ParagraphParse;
