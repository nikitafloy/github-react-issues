import './Loading.scss';
export default {
    randomAnimLength: (min, maxRandom, animString = '') => {
        for (let i = 0; i < min + Math.random() * Math.floor(maxRandom); i++) animString = animString + '⠀';
        return animString;
    },
    randomTextLength: (arr = []) => {
        for (let i = 0; i < 5 + Math.random() * Math.floor(30); i++) arr.push(i);
        return arr;
    },    
};