import axios from 'axios';
import TimeAgo from 'javascript-time-ago';
import ru from 'javascript-time-ago/locale/ru';
 
TimeAgo.addLocale(ru);
 
// cyka blyat
const timeAgo = new TimeAgo('ru-RU');

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
        const res = await axios.post('https://api.github.com/markdown', {
            "text" : body,
            "mode" : "markdown",
            "context" : "none",
        });
        if (!res) {
            console.error(res);
            return false;
        };
        return res;
    },
};