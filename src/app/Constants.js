const getTodayDate = () => new Date();
const getTomorrowDate = () => {
    let tomorrow = new Date();
    tomorrow.setDate(getTodayDate().getDate() + 1);

    return tomorrow;
};
const getThisWeekDate = () => {
    let today = new Date();
    let firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1));
    let lastDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 7));

    return {firstDayOfWeek, lastDayOfWeek};
};
const getThisMonthDate = () => {
    let today = new Date();
    let firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    let lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    return {firstDayOfMonth, lastDayOfMonth};
};

export const timeRanges = {
    ANYTIME: {
        description: 'Anytime',
        fromTime: null,
        toTime: null,
    },
    TODAY: {
        description: 'Today',
        fromTime: getTodayDate(),
        toTime: getTodayDate(),
    },
    TOMORROW: {
        description: 'Tomorrow',
        fromTime: getTomorrowDate(),
        toTime: getTomorrowDate(),
    },
    THIS_WEEK: {
        description: 'This week',
        fromTime: getThisWeekDate().firstDayOfWeek,
        toTime: getThisWeekDate().lastDayOfWeek,
    },
    THIS_MONTH: {
        description: 'This month',
        fromTime: getThisMonthDate().firstDayOfMonth,
        toTime: getThisMonthDate().lastDayOfMonth,
    },
    LATER: {
        description: 'Later',
        fromTime: null,
        toTime: null,
    },
};

export const tags = ['All', 'Exhibition', 'Entertainment', 'Musical', 'Sale', 'Sport', 'Dance'];
