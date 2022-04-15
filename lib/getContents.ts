import { pairProps } from './getProperty';

export type Result = {
  content: string;
  isFocused: boolean;
  focus?: {
    depth: number;
    type: boolean;
  };
};

export const getContents = (
  content: string,
  property: pairProps[],
  isContainEnvName: boolean = false,
  needFocusInfo: boolean = false
): Result[] => {
  let results: Result[] = [];
  let startIndex = 0;

  for (let i = 0; i < property.length; i++) {
    const plane = content.substring(startIndex, property[i].begin.location);
    const inside = isContainEnvName
      ? content.substring(
          property[i].begin.location,
          property[i].end.location + property[i].end.str.length
        )
      : content.substring(
          property[i].begin.location + property[i].begin.str.length,
          property[i].end.location
        );

    const focus = needFocusInfo
      ? {
          depth: property[i].nextDepth,
          type: property[i].pairType,
        }
      : undefined;

    results.push({
      content: plane,
      isFocused: false,
      focus: focus,
    });

    results.push({
      content: inside,
      isFocused: true,
      focus: focus,
    });

    startIndex = property[i].end.location + property[i].end.str.length;
  }

  // 最後の部分
  results.push({
    content: content.substring(startIndex, content.length),
    isFocused: false,
  });

  return results;
};

export const getNestedContents = (
  content: string,
  locations: number[],
  sep: string,
  property: pairProps[]
) => {
  let startIndex = 0;

  const results = locations.map((location) => {
    let result: Result[] = [];

    const insideProperty = property
      .filter(
        (prop) =>
          startIndex < prop.begin.location && prop.end.location < location
      )
      .map((prop) => ({
        ...prop,
        begin: {
          location: prop.begin.location - startIndex,
          str: prop.begin.str,
        },
        end: {
          location: prop.end.location - startIndex,
          str: prop.end.str,
        },
      }));

    const flat = content.substring(startIndex, location);

    if (insideProperty.length) {
      result = insideProperty.length
        ? // needFocusInfo を true にする
          getContents(flat, insideProperty, false, true)
        : [];
    } else {
      result = [
        {
          content: flat.trim(),
          isFocused: false,
        },
      ];
    }

    startIndex = location + sep.length;

    return result;
  });

  return results;
};
