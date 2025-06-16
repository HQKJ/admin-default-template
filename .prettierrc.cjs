module.exports = {
  // 每行代码的最大宽度，超过则换行
  printWidth: 100,
  // 语句末尾添加分号
  semi: true,
  // 缩进的空格数
  tabWidth: 2,
  // 使用单引号而不是双引号
  singleQuote: true,
  // 在对象、数组等末尾添加逗号（如 { a: 1, b: 2, }）
  trailingComma: "all",
  // Markdown 文本不自动换行
  proseWrap: "never",
  // HTML 标签的空格敏感性，严格模式（不忽略空格）
  htmlWhitespaceSensitivity: "strict",
  // 根据操作系统自动选择换行符（LF 或 CRLF）
  endOfLine: "auto",
  
  // 针对特定文件的覆盖配置
  overrides: [
    {
      // 针对以 rc 结尾的文件（如 .eslintrc、.prettierrc 等）
      files: "*rc",
      options: {
        // 使用 JSON 解析器格式化这些文件
        parser: "json",
      },
    },
  ]
};
