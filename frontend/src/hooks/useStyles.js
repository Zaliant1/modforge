export const getStyle = (styles, bemName) => {
  const { [bemName]: style } = styles || {}
  return style || {}
}

export const cx = (styles, ...keys) =>
  keys.reduce((merged, key) => {
    if (!key) return merged
    const { [key]: style } = styles || {}
    return { ...merged, ...style }
  }, {})
