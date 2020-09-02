import './Loading.scss';
export default {
    randomTextLength: (arr = []) => {
        const max = 30;
        const min = max;
        for (let i = 0; i < 5 + Math.floor(min + Math.random() * (max + 1 - min)); i++) arr.push(i);
        return arr;
    },    
};