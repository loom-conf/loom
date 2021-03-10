export const useConsts = () => {
  const KeySizeBase = 52
  const KeyConsts = {
    outerMargin: 16,
    padding: 1,
    border: 1,
    outerBorder: 1,
  } as const
  const calcKeySize = (u: number) => KeySizeBase * u
  return { KeyConsts, calcKeySize }
}
