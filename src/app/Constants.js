import * as event1 from './assets/event-1.jpg';
import * as event3 from './assets/event-3.jpg';
import * as event51 from './assets/event-5-1.jpg';
import * as event52 from './assets/event-5-2.jpg';
import * as event53 from './assets/event-5-3.jpg';
import * as event54 from './assets/event-5-4.jpg';
import * as event61 from './assets/event-6-1.jpg';
import * as event62 from './assets/event-6-2.png';
import * as event63 from './assets/event-6-3.png';
import * as event64 from './assets/event-6-4.png';
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
        id: 0,
        user: {
            username: 'Sophia',
            picture: user1,
        },
        title: 'The Little Prince: A Story',
        tagId: 1,
        startTime: '2018-06-01T08:30:00',
        endTime: '2018-06-30T17:00:00',
        publishTime: '2018-05-20',
        content: 'Find out more about the author, Antoine de Saint-Exupéry, through his photos, personal belongings, manuscripts, illustrations and other philatelic materials. Relive, through these artefacts, his experiences that shaped his magnum opus, The Little Prince.',
        image: [event1],
        location: {
            lnglat: [103.8486912, 1.2928531],
            description: 'Singapore Philatelic Museum',
        },
    },
    {
        id: 1,
        user: {
            username: 'William',
            picture: user2,
        },
        title: 'Jurassic World @ Universal Studios Singapore™',
        tagId: 2,
        startTime: '2018-06-01T10:00:00',
        endTime: '2018-08-22T20:30:00',
        publishTime: '2018-05-27',
        content: 'This epic event will see dinosaurs take over Universal Studios Singapore™ from June to August. Walk among these extinct giants, now risen back to life, and enjoy many selfie opportunities with them. Enjoy high-octane shows and see what it might have been like by plunging yourself into a lifelike augmented reality simulation.',
        image: [],
        location: {
            lnglat: [103.8238084, 1.2540421],
            description: 'Universal Studios Singapore',
        },
    },
    {
        id: 2,
        user: {
            username: 'Jacob',
            picture: user3,
        },
        title: 'The Great Singapore Sale',
        tagId: 4,
        startTime: '2018-06-08T00:00:00',
        endTime: '2018-08-12T00:00:00',
        publishTime: '2018-03-28',
        content: 'Every summer, shopping-obsessed Singapore invites one and all to partake in irresistible sales. If you happen to be in town during this period, you’re in luck! You’ll be treated to big discounts on a myriad of shopping and even unique experiences at amusement parks and restaurants.',
        image: [event3],
        location: {
            lnglat: [103.8377971, 1.3017996],
            description: 'Orchard Road',
        },
    },
    {
        id: 3,
        user: {
            username: 'Isabella',
            picture: user4,
        },
        title: 'RWS Football Fever',
        tagId: 5,
        startTime: '2018-06-14T16:00:00',
        endTime: '2018-07-15T20:00:00',
        publishTime: '2018-06-03',
        content: 'The best ‘live’ football screening experience of the year invites you to cheer on your favourite squads, while enjoying live performances, themed activities with attractive prizes, great food and drinks, and more. Don’t miss this chance to truly get into the game, through an immersive football experience like no other!',
        image: [],
        location: {
            lnglat: [103.8196336, 1.2563293],
            description: 'Resorts World™ Theatre',
        },
    },
    {
        id: 4,
        user: {
            username: 'Alexander',
            picture: user5,
        },
        title: 'M1 CONTACT Contemporary Dance Festival',
        tagId: 6,
        startTime: '2018-06-15T12:00:00',
        endTime: '2018-08-04T22:30:00',
        publishTime: '2018-04-20',
        content: 'Led by experienced Festival Director, Kuik Swee Boon, this unique dance festival not only lets you admire bold choreography and powerful works, but also aims to pique the curiosity of its attendees with dance workshops and technique classes. Billed for its bold curation, residency programmes, commissioning of local and international works across its several platforms, as well as a smorgasbord of workshops and technique classes, the annual M1 CONTACT Contemporary Dance Festival is presented by Singapore’s leading contemporary dance company, T.H.E Dance Company. With our signature events, festival commissions and free performances, experience the passion and artistry of local, Southeast Asian and international dance artists in the 9th edition of our Festival.',
        image: [event51, event52, event53, event54],
        location: {
            lnglat: [103.8558166, 1.2897934],
            description: 'Esplanade Theatre Studio',
        },
    },
    {
        id: 5,
        user: {
            username: 'Olivia',
            picture: user6,
        },
        title: 'THE LION KING',
        tagId: 3,
        startTime: '2018-06-27T12:00:00',
        endTime: '2018-07-12T18:00:00',
        publishTime: '2018-05-13',
        content: 'One of today’s most celebrated theatrical productions, THE LION KING retells Simba’s coming of age story with the help of award-wining actors and dancers, as well as breath-taking costumes and sets. Sing along to THE LION KING’s catchy tunes, composed by Sir Elton John and Tim Rice, and soak in what many critics have called “an unforgettable experience”.',
        image: [event61, event62, event63, event64],
        location: {
            lnglat: [103.8607264, 1.2833754],
            description: 'Marina Bay Sands',
        },
    },
];
