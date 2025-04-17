function generateToken(length = 32) {
  return [...Array(length)].map(() => (~~(Math.random() * 36)).toString(36)).join('');
}

module.exports = {
  generateToken,
};
