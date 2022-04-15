import React from 'react';
import { getEnvProperty, getLocation } from '../../lib/getProperty';
import { getNestedContents } from '../../lib/getContents';
import InnerParse from './parse-inner';

type Props = {
  content: string;
  depth?: number;
  isWithTitle?: boolean;
  isOutermost?: boolean;
};

/**
 * 証明の各ステップ（段落）をパースします。
 * @return p 要素と ol 要素を内側に含む div 要素 or それを内側に含む details 要素
 */
const StepParse = ({
  content,
  depth,
  isWithTitle,
  isOutermost = false,
}: Props) => {
  // content の format と step 名
  let formatedContent = content;
  let title = '';
  if (isWithTitle) {
    const titleEnd = content.indexOf('\\par\n');
    formatedContent = content.substring(titleEnd + 4);
    title = content.substring(0, titleEnd);
  }

  const framedProperty = getEnvProperty(formatedContent, depth, 'oframed');

  const avoid = framedProperty.map((prop) => {
    return {
      left: prop.begin.location,
      right: prop.end.location,
    };
  });
  const parLocation = getLocation(formatedContent, '\\\\par\\n', avoid);

  const nestedResults = getNestedContents(
    formatedContent,
    parLocation,
    '\\par\n',
    framedProperty
  );

  const items = nestedResults.map((results, outIndex) =>
    results.some(
      (result) => result.content || typeof result.focus !== 'undefined'
    ) ? (
      <li
        key={outIndex}
        className='marker:font-sans marker:text-xs marker:font-extrabold marker:text-gray-700/70'
      >
        {results.map((result, index) => (
          <React.Fragment key={index}>
            {result.isFocused ? (
              <ProofParse
                content={result.content}
                depth={result.focus?.depth}
                isOutermost={result.focus?.type}
              />
            ) : (
              <InnerParse content={result.content} />
            )}
          </React.Fragment>
        ))}
      </li>
    ) : (
      <></>
    )
  );

  const step = (
    <div>
      {title ? (
        <p>
          <InnerParse content={title} />
        </p>
      ) : (
        <></>
      )}
      <ol className='list-decimal'>{items}</ol>
    </div>
  );

  return isOutermost ? (
    step
  ) : (
    <details className='pl-2 border-l-2 border-l-white open:border-l-gray-200'>
      <summary className='marker:text-sm'>詳細</summary>
      {step}
    </details>
  );
};

/**
 * proof 環境をパースします。
 * @return stepParse の返り値の列を内側に含む div 要素
 */
const ProofParse = ({ content, depth = 1, isOutermost = false }: Props) => {
  const stepContent = content
    .split(/%Step\d*/)
    .filter((step) => step.search(/[^\s]/) != -1);

  const isWithTitle = stepContent.length == 1 ? false : true;

  return (
    <div>
      {stepContent.map((step, index) => (
        <React.Fragment key={index}>
          <StepParse
            content={step}
            depth={depth}
            isWithTitle={isWithTitle}
            isOutermost={isOutermost}
          />
        </React.Fragment>
      ))}
    </div>
  );
};

export default ProofParse;
