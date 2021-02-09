export const useConsts = () => {
  const KeySizeBase = 52
  const KeyConsts = {
    margin: 10,
    padding: 1,
    border: 1,
  } as const
  const calcKeySize = (u: number) => KeySizeBase * u
  return { KeyConsts, calcKeySize }
}
