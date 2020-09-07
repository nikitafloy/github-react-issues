import axios, { AxiosResponse, AxiosPromise } from 'axios';
import TimeAgo from 'javascript-time-ago';
import ru from 'javascript-time-ago/locale/ru';
import { markdownPostQueryData, markdownPostQueryConfig } from './TypeScript/utils';

TimeAgo.addLocale(ru);

const timeAgo = new TimeAgo('ru-RU');

let requestsCount = 0;
const [min, max] = [10, 30];
export default {
  formatDate: (date: string): string => timeAgo.format(Date.parse(date)).toLowerCase(),
  formatWordEnd: (num: number, cases: { nom: string; gen: string; plu: string }): string => {
    num = Math.abs(num);
    let word = '';
    if (num.toString().indexOf('.') > -1) {
      word = cases.gen;
    } else {
      word = num % 10 === 1 && num % 100 !== 11
        ? cases.nom
        : num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20)
          ? cases.gen
          : cases.plu;
    }
    return word;
  },
  markdownToHTML: async (body: string): Promise<string | boolean> => {
    console.log(`requestsCount: ${requestsCount}`);
    if (requestsCount > 100) {
      console.error('Превышено количество запросов в рендере');
      return false;
    }
    requestsCount++;

    try {
      const data: markdownPostQueryData = {
        text: body,
        mode: 'markdown',
        context: 'none',
      };
      const config: markdownPostQueryConfig = {
        headers: {
          Authorization: 'token e73a8674f86e66b6de244fe01f1c93a21edbcf23',
        },
      };
      const result: AxiosResponse = await axios.post<AxiosPromise>(
        'https://api.github.com/markdown',
        data,
        config,
      );
      return result.data;
    } catch (e) {
      console.error(e);
      return false;
    }
  },
  randomArray: (): never[] => Array.from({ length: 5 + Math.floor(min + Math.random() * (max + 1 - min)) }),
};
