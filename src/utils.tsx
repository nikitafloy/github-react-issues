import React, { ReactElement } from 'react';

// Axios
import axios, { AxiosResponse } from 'axios';

// Time Ago
import TimeAgo from 'javascript-time-ago';
// eslint-disable-next-line import/no-unresolved
import ru from 'javascript-time-ago/locale/ru';

// TypeScript
import { markdownPostQueryData, markdownPostQueryConfig, markdownApiUrl } from './TypeScript/utils';

// Words
import words from './words';

// Constants
import { constants, markdownData } from './constants';

const { AUTH_TOKEN } = constants;

TimeAgo.addLocale(ru);
const timeAgo = new TimeAgo('ru-RU');

let requestsCount = 0;
const [min, max] = [10, 30];

export default {
  formatDate: (date: string): string => (timeAgo.format(Date.parse(date)) as string).toLowerCase(),

  formatWordEnd: (num: number, cases: { nom: string; gen: string; plu: string }): string => {
    // eslint-disable-next-line no-param-reassign
    num = Math.abs(num);
    let word = '';
    if (num.toString().indexOf('.') > -1) {
      word = cases.gen;
    } else {
      // eslint-disable-next-line no-nested-ternary
      word = num % 10 === 1 && num % 100 !== 11
        ? cases.nom
        : num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20)
          ? cases.gen
          : cases.plu;
    }
    return word;
  },

  markdownToHTML: async (body: string): Promise<string | boolean> => {
    // eslint-disable-next-line no-console
    console.log(`requestsCount: ${requestsCount}`);

    if (requestsCount > 100) {
      throw new Error(words.QUERIES_RENDER_LIMIT);
    }

    requestsCount += 1;

    try {
      const data: markdownPostQueryData = {
        text: body,
        mode: markdownData.MARKDOWN_MODE_DATA,
        context: markdownData.MARKDOWN_CONTEXT_DATA,
      };

      let config: markdownPostQueryConfig = {};
      if (AUTH_TOKEN) config = { ...config, headers: { Authorization: `token ${AUTH_TOKEN}` } };

      const result: AxiosResponse = await axios.post(
        markdownData.MARKDOWN_API_URL as markdownApiUrl, data, config,
      );

      return result.data;
    } catch (e) {
      throw new Error(e);
    }
  },

  randomArray: (): never[] => Array
    .from({ length: 5 + Math.floor(min + Math.random() * (max + 1 - min)) }),

  randomLoadingArray: (length: number): Array<ReactElement> => Array.from({ length: length < 1 ? 1 : length }, (_, k) => (<div key={`loading-${k}`} className="loading_100" />)),
};
