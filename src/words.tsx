// TypeScript
import { endWords } from './TypeScript/words';

// Block END_OF_WORDS
const comments: endWords = {
  nom: 'комментарий',
  gen: 'комментария',
  plu: 'комментариев',
};

export default {
  ISSUE_CLOSED_AT: 'Вопрос закрыт',
  COMMENTS_TO_ISSUE: 'Комментарии к проблеме',
  NO_COMMENTS: 'Комментариев нет',
  END_OF_WORDS: { comments },
  WRITE_POST: 'написал пост',
  URL_CURRENT_PAGE: 'URL текущей страницы',
  URL_ON_ISSUE: 'Ссылка на issue',
  ENTER_URL_ISSUE_EXAMPLE: 'Введите ссылку на issues, например',
  IM_LAZY: 'Мне лень',
  TO_FIND: 'Найти',
  LEAVE_A_COMMENT: 'оставил комментарий',
  TO_MAIN_PAGE: 'На главную',
  QUERIES_RENDER_LIMIT: 'Превышено количество запросов в рендере',
};
