export const useConsts = () => {
  const KeySizeBase = 55
  const KeyConsts = {
    margin: 4,
    padding: 1,
    border: 1,
  } as const
  const calcKeySize = (u: number) => KeySizeBase * u
  return { KeyConsts, calcKeySize }
}