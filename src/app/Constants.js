import * as event1 from './assets/event-1.jpg';
import * as event3 from './assets/event-3.jpg';
import * as event5 from './assets/event-5.jpg';
import * as event6 from './assets/event-6.jpg';
import * as user1 from './assets/user-1.jpeg';
import * as user2 from './assets/user-2.jpeg';
import * as user3 from './assets/user-3.jpeg';
import * as user4 from './assets/user-4.jpeg';
import * as user5 from './assets/user-5.jpeg';
import * as user6 from './assets/user-6.jpeg';

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

export const events = [
    {
        id: 1,
        user: {
            username: 'Sophia',
            picture: user1,
        },
        title: 'The Little Prince: A Story',
        tagId: 1,
        startTime: '2018-06-01',
        endTime: '2018-06-30',
        content: 'Find out more about the author, Antoine de Saint-Exupéry, through his photos, personal belongings, manuscripts, illustrations and other philatelic materials. Relive, through these artefacts, his experiences that shaped his magnum opus, The Little Prince.',
        image: event1,
    },
    {
        id: 2,
        user: {
            username: 'William',
            picture: user2,
        },
        title: 'Jurassic World @ Universal Studios Singapore™',
        tagId: 2,
        startTime: '2018-06-01',
        endTime: '2018-08-22',
        content: 'This epic event will see dinosaurs take over Universal Studios Singapore™ from June to August. Walk among these extinct giants, now risen back to life, and enjoy many selfie opportunities with them. Enjoy high-octane shows and see what it might have been like by plunging yourself into a lifelike augmented reality simulation.',
    },
    {
        id: 3,
        user: {
            username: 'Jacob',
            picture: user3,
        },
        title: 'The Great Singapore Sale',
        tagId: 4,
        startTime: '2018-06-08',
        endTime: '2018-08-12',
        content: 'Every summer, shopping-obsessed Singapore invites one and all to partake in irresistible sales. If you happen to be in town during this period, you’re in luck! You’ll be treated to big discounts on a myriad of shopping and even unique experiences at amusement parks and restaurants.',
        image: event3,
    },
    {
        id: 4,
        user: {
            username: 'Isabella',
            picture: user4,
        },
        title: 'RWS Football Fever',
        tagId: 5,
        startTime: '2018-06-14',
        endTime: '2018-07-15',
        content: 'The best ‘live’ football screening experience of the year invites you to cheer on your favourite squads, while enjoying live performances, themed activities with attractive prizes, great food and drinks, and more. Don’t miss this chance to truly get into the game, through an immersive football experience like no other!',
    },
    {
        id: 5,
        user: {
            username: 'Alexander',
            picture: user5,
        },
        title: 'M1 CONTACT Contemporary Dance Festival',
        tagId: 6,
        startTime: '2018-06-15',
        endTime: '2018-08-04',
        content: 'Led by experienced Festival Director, Kuik Swee Boon, this unique dance festival not only lets you admire bold choreography and powerful works, but also aims to pique the curiosity of its attendees with dance workshops and technique classes.',
        image: event5,
    },
    {
        id: 6,
        user: {
            username: 'Olivia',
            picture: user6,
        },
        title: 'THE LION KING',
        tagId: 3,
        startTime: '2018-06-27',
        endTime: '2018-07-12',
        content: 'One of today’s most celebrated theatrical productions, THE LION KING retells Simba’s coming of age story with the help of award-wining actors and dancers, as well as breath-taking costumes and sets. Sing along to THE LION KING’s catchy tunes, composed by Sir Elton John and Tim Rice, and soak in what many critics have called “an unforgettable experience”.',
        image: event6,
    },
];
