export const getFormattedDate = date => (
    date.toISOString().substring(0, 10)
);

export const isValidDate = (dateString) => {
    let regexDate = /^\d{4}\-\d{1,2}\-\d{1,2}$/;

    if (!regexDate.test(dateString)) {
        return false;
    }

    let parts = dateString.split('-');
    let day = parseInt(parts[2], 10);
    let month = parseInt(parts[1], 10);
    let year = parseInt(parts[0], 10);

    if (year < 1000 || year > 3000 || month == 0 || month > 12) {
        return false;
    }

    let monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)) {
        monthLength[1] = 29;
    }

    return day > 0 && day <= monthLength[month - 1];
};

export const hasOverlap = (dateLeftFrom, dateLeftTo, dateRightFrom, dateRightTo) => {
    if (dateLeftFrom <= dateRightFrom && dateRightFrom <= dateLeftTo) return true;
    if (dateLeftFrom <= dateRightTo && dateRightTo <= dateLeftTo) return true;
    if (dateRightFrom < dateLeftFrom && dateLeftTo < dateRightTo) return true;

    return false;
};

export const getWordCount = str => str.split(' ').length;

export const getStringWithLimit = (str, limit) => str.substring(0, Math.min(str.length, 300)) + '...';

export const getDateString = date => {
    let locale = 'en-us';
    let month = date.toLocaleString(locale, {month: 'long'});
    let day = date.getDate();
    let year = date.getFullYear();

    return `${day} ${month} ${year}`;
};

export const getTimeString = date => {
    let locale = 'en-us';
    let timeParts = date.toLocaleTimeString(locale).replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, '$1$3').split(' ');

    return {
        time: timeParts[0],
        period: timeParts[1].toLowerCase(),
    };
};

let keys = {37: 1, 38: 1, 39: 1, 40: 1};

function preventDefault(e) {
    e = e || window.event;
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.returnValue = false;
}

function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}

export function disableScroll() {
    console.log('disable scroll');
    if (window.addEventListener) {
        window.addEventListener('DOMMouseScroll', preventDefault, false);
    }

    window.onwheel = preventDefault;

    document.ontouchmove = function(e) {
        e.preventDefault();
    };
}

export function enableScroll() {
    console.log('enable scroll');
    if (window.removeEventListener) {
        window.removeEventListener('DOMMouseScroll', preventDefault, false);
    }
    window.onwheel = null;

    document.ontouchmove = function(e) {
        return true;
    };
}
