export default score => {
  return (parseFloat(score).toFixed(2)) - 0.01;
}