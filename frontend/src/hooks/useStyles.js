export const useStyles = (styles, bemName) => {
  const { [bemName]: style } = styles || {}
  return style || {}
}
