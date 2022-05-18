export default function timestampToTime() {
        const date = new Date();
        const Y = date.getFullYear() + '-';
        const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        const D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate() + ' ';
        const hh = date.getHours() < 10 ? '0' + date.getHours() +':': date.getHours() + ":";
        const mm = date.getMinutes() < 10 ? '0' + date.getMinutes()+':' : date.getMinutes() + ':';
        const ss = date.getSeconds() < 10 ? '0' + date.getSeconds()+' ' : date.getSeconds()+' ';
        return Y + M + D +'  '+ hh + mm + ss;
    }
