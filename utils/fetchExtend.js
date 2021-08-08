import fetch from 'node-fetch';

function merge(target, source) {
  for (const key of Object.keys(source)) {
    if (source[key] instanceof Object)
      Object.assign(source[key], merge(target[key], source[key]));
  }

  Object.assign(target || {}, source);
  return target;
}

function extend(args) {
  const { prefixUrl, options } = args;
  const fetchExtended = (appendUrl, appendOptions) => {
    return fetch(
      `${prefixUrl.replace(/[/]+$/, '')}/${appendUrl.replace(/^[/]+/, '')}`,
      merge(options || {}, appendOptions || {})
    );
  };
  return fetchExtended;
}

export default extend;
