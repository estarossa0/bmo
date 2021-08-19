import fetch from 'node-fetch';

function merge(target: any, source: any) {
  for (const key of Object.keys(source)) {
    if (source[key] instanceof Object)
      Object.assign(source[key], merge(target[key], source[key]));
  }

  Object.assign(target || {}, source);
  return target;
}

function extend(args: { prefixUrl: string; options: any }) {
  const { prefixUrl, options } = args;
  const fetchExtended = (
    appendUrl: string,
    appendOptions?: RequestInfo
  ): Promise<Response> => {
    return fetch(
      `${prefixUrl.replace(/[/]+$/, '')}/${appendUrl.replace(/^[/]+/, '')}`,
      merge(options || {}, appendOptions || {})
    );
  };
  return fetchExtended;
}

export default extend;
