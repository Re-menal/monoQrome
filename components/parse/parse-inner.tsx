import React from 'react';
import { getEnvProperty, getLocation } from '../../lib/getProperty';
import { getContents, getNestedContents } from '../../lib/getContents';
import ParagraphParse from './parse-paragraph';
// import style from '../../styles/components/parse/innerParse.module.css';

type Props = {
  content: string;
  depth?: number;
  listType?: boolean;
};

/**
 * proof 環境以外の環境の中身をパースします。特に、 itemize 環境と enuerate 環境を変換します。
 * @param listType innerParse の内側で再帰呼び出しを行う際指定します。 false が itemize 、 true が enumerate を指します。
 * @return JSX 要素（ div 要素）
 */
const InnerParse = ({ content, depth = 1, listType }: Props) => {
  const listProperty = getEnvProperty(content, depth, 'itemize', 'enumerate');

  const avoid = listProperty.map((prop) => {
    return {
      left: prop.begin.location,
      right: prop.end.location,
    };
  });
  const itemLocation = getLocation(content, '\\\\item', avoid);

  if (itemLocation.length == 1) {
    if (!listProperty.length) return <ParagraphParse content={content} />;
    // needFocusInfo を true にする
    const results = getContents(content, listProperty, false, true);

    return (
      <div>
        {results.map((result, index) => (
          <React.Fragment key={index}>
            {result.isFocused ? (
              <InnerParse
                content={result.content}
                depth={result.focus?.depth}
                listType={result.focus?.type}
              />
            ) : (
              <ParagraphParse content={result.content} />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  }

  const nestedResults = getNestedContents(
    content,
    itemLocation,
    '\\item',
    listProperty
  );

  const list: JSX.Element[] = nestedResults.map((results, outIndex) =>
    results.some(
      (result) => result.content || typeof result.focus !== 'undefined'
    ) ? (
      <li key={outIndex} className='marker:font-sans marker:font-bold'>
        {results.map((result, index) => (
          <React.Fragment key={index}>
            {result.isFocused ? (
              <InnerParse
                content={result.content}
                depth={result.focus?.depth}
                listType={result.focus?.type}
              />
            ) : (
              <ParagraphParse content={result.content} />
            )}
          </React.Fragment>
        ))}
      </li>
    ) : (
      <></>
    )
  );

  return !listType ? (
    <ul className='list-disc'>{list}</ul>
  ) : (
    <ol className='list-decimal'>{list}</ol>
  );
};

export default InnerParse;
