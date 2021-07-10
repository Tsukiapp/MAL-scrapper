export default (score: string): number => {
  let tmp: string = parseFloat(score).toFixed(2);
  return (parseFloat(tmp) - 0.01)
}