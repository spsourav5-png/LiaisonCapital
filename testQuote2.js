(async () => {
  const url = 'https://api.uniswap.org/v1/quote?tokenInAddress=0xdAC17F958D2ee523a2206206994597C13D831ec7&tokenInChainId=1&tokenOutAddress=0xa2f93b5333E82E281764005b88EEfdC9E1dEC921&tokenOutChainId=1&amount=1000000&type=exactIn';
  const res = await fetch(url, {
    headers: {
      'Origin': 'https://app.uniswap.org',
    }
  });
  console.log(res.status, await res.text());
})();
