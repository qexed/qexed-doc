module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // 添加 markdown 文件处理规则
      webpackConfig.module.rules.push({
        test: /\.md$/,
        use: 'raw-loader',
      });
      
      return webpackConfig;
    },
  },
};