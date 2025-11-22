module.exports = (u1, u2) => {
  return [u1.toString(), u2.toString()].sort().join("_");
};