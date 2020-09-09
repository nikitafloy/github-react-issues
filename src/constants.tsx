const constants = {
  ISSUES_API_URL: (username: string, repo: string, id?: string): string => `https://api.github.com/repos/${username}/${repo}/issues${id ? `/${id}` : ''}`,
  EXAMPLE_URL: 'https://github.com/negezor/vk-io/issues',
  EXAMPLE_USERNAME: 'negezor',
  EXAMPLE_REPO: 'vk-io',
  AUTH_TOKEN: 'e73a8674f86e66b6de244fe01f1c93a21edbcf23',
  MARKDOWN_API_URL: 'https://api.github.com/markdown',
};

type markdownConstants = {
    MARKDOWN_MODE_DATA: 'markdown';
    MARKDOWN_CONTEXT_DATA: 'none';
};

const markdownData: markdownConstants = {
  MARKDOWN_MODE_DATA: 'markdown',
  MARKDOWN_CONTEXT_DATA: 'none',
};

export default { ...constants, markdownData };
