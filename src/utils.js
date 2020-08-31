import axios from 'axios';
import TimeAgo from 'javascript-time-ago';
import ru from 'javascript-time-ago/locale/ru';
 
TimeAgo.addLocale(ru);
 
// cyka blyat
const timeAgo = new TimeAgo('ru-RU');

let requestsCount = 0;

export default {
    formatDate: date => timeAgo.format(Date.parse(date)).toLowerCase(),
    formatWordEnd: (num, cases) => {
        num = Math.abs(num);
        var word = '';
        if (num.toString().indexOf('.') > -1) {
            word = cases.gen;
        } else { 
            word = (
                num % 10 === 1 && num % 100 !== 11 
                    ? cases.nom
                    : num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20) 
                        ? cases.gen
                        : cases.plu
            );
        };       
        return word;
   },
    bodyToMarkdown: async body => {
        console.log(`requestsCount: ${requestsCount}`)
        if (requestsCount > 10) {
            return console.error('Превышено количество запросов за сессию');
        };
        requestsCount++;

        try {
            return await axios.post('https://api.github.com/markdown', {
                "text" : body,
                "mode" : "markdown",
                "context" : "none",
            }, {
                headers: {
                    "Authorization": "token e73a8674f86e66b6de244fe01f1c93a21edbcf23",
                }
            });
        } catch (e) {
            console.error(e);
            return false;
        };
    },
};