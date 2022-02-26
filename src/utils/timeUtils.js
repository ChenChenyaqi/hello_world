import moment from 'moment';

function  timestampToTime(timeStr) {
    const time = parseInt(timeStr)
    return  moment(time).fromNow()
}

export {timestampToTime}
