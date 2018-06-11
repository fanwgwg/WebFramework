export const authenticate = (email, password, callback) => {
    const info = {email, password};
    fetch(`http://localhost:3000/auth`, {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(info),
    }).then(response => {
        return response.json();
    }).then(json => {
        callback(json);
    });
};

export const getAllUsers = (token, callback) => {
    fetch(`http://localhost:3000/users`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    }).then(response => {
        return response.json();
    }).then(json => {
        callback(json);
    });
};

export const getUserById = (token, id, callback) => {
    fetch(`http://localhost:3000/users/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    }).then(response => {
        return response.json();
    }).then(json => {
        callback(json);
    });
};

export const getAllEvents = (token, callback) => {
    fetch('http://localhost:3000/events', {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    }).then(response => {
        return response.json();
    }).then(json => {
        callback(json);
    });
};

export const getEventById = (token, id, callback) => {
    fetch(`http://localhost:3000/events/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    }).then(response => {
        return response.json();
    }).then(json => {
        getEventResponses(token, id, responses => {
            callback({
                event: json,
                responses,
            });
        });
    });
};

export const getMultipleEvents = (token, ids, callback) => {
    let requests = ids.map(id =>
        fetch(`http://localhost:3000/events/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        }).then(response => response.json())
    );

    Promise.all(requests).then(values => {
        callback(values);
    });
};

export const getEventResponses = (token, id, callback) => {
    let likes = [];
    let going = [];

    getAllUsers(token, users => {
        users.forEach(user => {
            if (user.likes.includes(id)) {
                likes.push({
                    userid: user.id,
                    username: user.username,
                    picture: user.picture,
                });
            }

            if (user.going.includes(id)) {
                going.push({
                    userid: user.id,
                    username: user.username,
                    picture: user.picture,
                });
            }
        });

        callback({likes, going});
    });
};

export const goForEvent = (token, userId, eventId, isGoing, callback) => {
    getUserById(token, userId, user => {
        let going = user.going;

        if (isGoing) {
            going.push(eventId);
        } else {
            let index = going.indexOf(eventId);
            if (index >= 0) {
                going.splice(index, 1);
            }
        }

        user.going = going;

        fetch(`http://localhost:3000/users/${userId}`, {
            method: 'put',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(user),
        }).then(response => {
            return response.json();
        }).then(json => {
            callback();
        });
    });
};

export const likeEvent = (token, userId, eventId, like, callback) => {
    getUserById(token, userId, user => {
        let likes = user.likes;

        if (like) {
            likes.push(eventId);
        } else {
            let index = likes.indexOf(eventId);
            if (index >= 0) {
                likes.splice(index, 1);
            }
        }
        user.likes = likes;

        fetch(`http://localhost:3000/users/${userId}`, {
            method: 'put',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(user),
        }).then(response => {
            return response.json();
        }).then(json => {
            callback();
        });
    });
};

export const commentToEvent = (token, event, comment, callback) => {
    if (event.comments) {
        event.comments.push(comment);
    } else {
        event.comments = [comment];
    }

    fetch(`http://localhost:3000/events/${event.id}`, {
        method: 'put',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(event),
    }).then(response => {
        return response.json();
    }).then(json => {
        callback();
    });
};
