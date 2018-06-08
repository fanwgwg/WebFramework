export const getAllUsers = (callback) => {
    fetch(`http://localhost:3000/users`)
        .then(response => {
            return response.json();
        }).then(json => {
            callback(json);
        });
};

export const getUserById = (id, callback) => {
    fetch(`http://localhost:3000/users/${id}`)
        .then(response => {
            return response.json();
        }).then(json => {
            callback(json);
        });
};

export const getAllEvents = (callback) => {
    fetch('http://localhost:3000/events')
        .then(response => {
            return response.json();
        }).then(json => {
            callback(json);
        });
};

export const getEventById = (id, callback) => {
    fetch(`http://localhost:3000/events/${id}`)
        .then(response => {
            return response.json();
        }).then(json => {
            callback(json);
        });
};

export const getEventResponses = (id, callback) => {
    let likes = [];
    let going = [];

    getAllUsers(users => {
        users.forEach(user => {
            if (user.likes.includes(id)) {
                likes.push({
                    username: user.username,
                    picture: user.picture,
                });
            }

            if (user.going.includes(id)) {
                going.push({
                    username: user.username,
                    picture: user.picture,
                });
            }
        });

        callback({likes, going});
    });
};

export const goForEvent = (userId, eventId, going, callback) => {
    getUserById(userId, user => {
        let going = user.going;

        if (going) {
            going.push(eventId);
        } else {
            let index = going.indexOf(eventId);
            if (index >= 0) {
                going.splice(index, 1);
            }
        }

        fetch(`http://localhost:3000/users/${userId}`, {
            method: 'put',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                going: going,
            }),
        }).then(response => {
            return response.json();
        }).then(json => {
            callback();
        });
    });
};

export const likeEvent = (userId, eventId, like, callback) => {
    getUserById(userId, user => {
        let likes = user.likes;

        if (like) {
            likes.push(eventId);
        } else {
            let index = likes.indexOf(eventId);
            if (index >= 0) {
                likes.splice(index, 1);
            }
        }

        fetch(`http://localhost:3000/users/${userId}`, {
            method: 'put',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                likes: likes,
            }),
        }).then(response => {
            return response.json();
        }).then(json => {
            callback();
        });
    });
};
