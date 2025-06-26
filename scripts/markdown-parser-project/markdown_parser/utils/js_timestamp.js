const twoDaysAgo = new Date();
twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
const timestamp = twoDaysAgo.getTime();

console.log(timestamp);
