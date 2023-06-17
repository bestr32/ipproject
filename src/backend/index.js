const express = require('express');
const http = require('http');
const mysql = require('mysql2');
const image_upload = require('express-fileupload');
const { createHash } = require('node:crypto');
const fs = require('fs');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173'
    }
});

app.use(image_upload());
app.use(cors({
    origin: 'http://localhost:5173'
}));
app.use(express.json());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'social_media',
});

connection.connect(function(err) {
    if (err) throw err;
    console.log('Connected');
});

function sha256(content) {  
    return createHash('sha3-256').update(content).digest('hex')
}


app.post('/createuser', (req, res) => {
    const user = {
        name: req.body.name,
        password: req.body.password,
        email: req.body.email,
    };

    if (user.name === undefined) {
        res.status(400).json({ message: 'Please enter a name.', status: 400 });
        return;
    }

    if (user.password === undefined) {
        res.status(400).json({ message: 'Please enter a password.', status: 400 });
        return;
    }

    if (user.password.length < 8) {
        res.status(400).json({ message: 'Please enter a password that is at least 8 characters long.', status: 400 });
        return;
    }

    let uppercase_flag = false;
    let number_flag = false;

    for (let i = 0; i < user.password.length; i++) {
        if (uppercase_flag === true && number_flag === true) break;

        if (user.password[i] >= 'A' && user.password[i] <= 'Z') uppercase_flag = true;

        if (user.password[i] >= '0' && user.password[i] <= '9') number_flag = true;
    }

    if (uppercase_flag === false || number_flag === false) {
        res.status(400).json({ message: 'Please enter a password with at least one uppercase character and one number.', status: 400 });
        return;
    }

    user.password = sha256(user.password);

    let sql = 'INSERT INTO user SET ?';
    let query = connection.query(sql, user, (err) => {
        if (err) throw err;

        res.status(200).json({ message: 'Successfully created account', status: 200 });
    });
});

app.post('/createpost', (req, res) => {
    const post = {
        user_id: req.body.user_id,
        heading: req.body.heading,
        body: req.body.body,
        type: req.body.type,
    };

    if ((post.type === 'text') && post.body === undefined || post.body === '') {
        res.send('You cannot submit an empty post.');
        return;
    }

    let sql = 'INSERT INTO post SET ?';
    let query = connection.query(sql, post, (err, result) => {
        if (err) throw err;

        let insert_id = result.insertId;
        let file_path = `./fs/post/${result.insertId}`;

        if (post.type === 'multimedia' || req.files) {
            console.log(req.files);
            let image = req.files.image;

            fs.mkdirSync(file_path, { recursive: true } , (err) => {
                if (err) throw err;
            });

            file_path += `/${image.name}`;

            fs.writeFile(file_path, image.data, (err) => {
                if (err) throw err;
            });

            let db_image_info = {
                path: file_path,
                post_id: insert_id,
            };

            let sql = 'INSERT INTO post_image SET ?';
            let query = connection.query(sql, db_image_info, (err) => {
                if (err) throw err;
            });
        }
    });

    res.status(200).json({ status: 200, message: 'Successfully created the post.' });
});

app.get('/get/post', (req, res) => {
    let post_id = req.query.post_id;

    let sql = 'SELECT heading, body, type, user_id FROM post WHERE post_id = ?';
    let query = connection.query(sql, post_id, (err, results) => {
        if (err) throw err;

        res.json(results);
    });
});

app.get('/get/post/image', (req, res) => {
    let post_id = req.query.post_id;

    res.sendFile(`./fs/post/${post_id}/post_image.png`, {root: __dirname});
});

app.get('/get/posts', (req, res) => {
    let sql = 'SELECT * FROM post';
    let query = connection.query(sql, (err, results) => {
        if (err) throw err;

        res.json(results);
    });
});

app.get('/get/alluserposts', (req, res) => {
    let user_id = req.query.user_id;

    let sql = 'SELECT * FROM post WHERE user_id = ?';
    let query = connection.query(sql, user_id, (err, results) => {
        if (err) throw err;

        res.json(results);
    });
});

app.post('/createfollower', (req, res) => {
    const follower = {
        user_id1: req.query.user_id1,
        user_id2: req.query.user_id2,
    };

    let sql = 'INSERT INTO follower SET ?';
    let query = connection.query(sql, follower, (err) => {
        if (err) throw err;

        res.send('Successfully added follower.');
    });
});

app.post('/login', (req, res) => {
    const login_details = {
        name: req.body.name,
        password: req.body.password,
    };

    let sql = 'SELECT * FROM user WHERE name = ?';
    let query = connection.query(sql, login_details.name, (err, results) => {
        if (err) throw err;

        if (results.length === 0) {
            res.status(404).json({ message: 'User not found', status: 404 });
            return;
        }

        let attempted_password = sha256(login_details.password);

        if (attempted_password === results[0].password) {
            res.status(200);
            res.json({ 
                message: 'Successfully logged in', 
                status: 200, 
                token: 'test123',
                userDetails: results[0],
            });
        } else {
            res.status(401);
            res.json({ message: 'Invalid credentials', status: 401 });
        }
    });
});

app.post('/conversation', (req, res) => {
    let sql = 'SELECT user_id FROM user WHERE name = ?';
    let query = connection.query(sql, req.query.recipient, (err, results) => {
        if (err) throw err;

        let conversation_details = {
            user_id1: req.query.sender,
            user_id2: results[0].user_id,
        };

        let sql = 'INSERT INTO conversation SET ?';
        let query = connection.query(sql, conversation_details, (err) => {
            if (err) throw err;

            res.send('Created conversation');
        });
    });
});

app.get('/get/userconversations', (req, res) => {
    let user_id = req.query.user_id;

    let sql = 'SELECT * FROM conversation WHERE user_id1=? OR user_id2=?';

    let query = connection.query(sql, [user_id, user_id], (err, results) => {
        if (err) throw err;

        res.json(results);
    });
});

app.get('/get/messages', (req, res) => {
    let sql = 'SELECT * FROM message WHERE conversation_id=?';
    let query = connection.query(sql, req.query.conversation_id, (err, results) => {
        if (err) throw err;

        res.json(results);
    });
});

app.get('/get/username', (req, res) => {
    let sql = 'SELECT name FROM user WHERE user_id=?';

    let query = connection.query(sql, req.query.user_id, (err, results) => {
        if (err) throw err;

        res.json(results);
    });
});

function broadcastMessage(message) {
    io.emit('chatMessage', message);
}

function getChatMessageDetails(messageId, callback) {
    let sql = `SELECT * FROM message WHERE message_id=?`;
    let query = connection.query(sql, messageId, (err, results) => {
        if (err) throw err;

        if (results.length === 0) {
            return callback(new Error('Chat message not found'));
        }

        const message = {
            id: results[0].message_id,
            conversation_id: results[0].conversation_id,
            sender_id: results[0].sender_id,
            content: results[0].content,
        }

        callback(null, message);
    });
}

function insertChatMessage(message) {
    let sql = 'INSERT INTO message SET ?';
    let query = connection.query(sql, message, (err, results) => {
        if (err) throw err;

        handleChatMessageInsert(results.insertId);
    });
}

function handleChatMessageInsert(messageId) {
    const message = getChatMessageDetails(messageId, (err, message) => {
        if (err) throw err;

        broadcastMessage(JSON.stringify(message));
    });

}

app.post('/message', (req, res) => {
    let message_details = {
        conversation_id: req.body.conversation_id,
        sender_id: req.body.sender_id,
        content: req.body.content,
    };

    let sql = 'INSERT INTO message SET ?';
    let query = connection.query(sql, message_details, (err, results) => {
        if (err) throw err;

        handleChatMessageInsert(results.insertId);

        // res.status(200).json({ status: 200, message: 'Message sent.' });
    });
});

io.on('connection', (socket) => {
    socket.on('chatMessage', (message) => {
        insertChatMessage(message);

    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Chat Logic (Trying to figure it out):
//  Conversation: (Conversation between two people)
//    conversation_id
//    user_id1
//    user_id2
//  Message:
//    message_id
//    conversation_id (foreign key)
//    sender_id
//    content/body

// create table follower(follower_id int AUTO_INCREMENT, user_id1 int, user_id2 int, PRIMARY KEY(follower_id), FOREIGN KEY(user_id1) REFERENCES user(user_id), FOREIGN KEY(user_id2) REFERENCES user(user_id));
// create table conversation(conversation_id int AUTO_INCREMENT, user_id1 int, user_id2 int, PRIMARY KEY(conversation_id), FOREIGN KEY(user_id1) REFERENCES user(user_id), FOREIGN KEY(user_id2) REFERENCES user(user_id));
// create table message(message_id int AUTO_INCREMENT, sender_id int, conversation_id int, content TEXT, PRIMARY KEY(message_id), FOREIGN KEY(sender_id) REFERENCES user(user_id), FOREIGN KEY(conversation_id) REFERENCES conversation(conversation_id));

server.listen(8080, () => {
    console.log('Server started on port 8080');
});

// Password
//   At least one uppercase letter, at least one number.

    // User -> id, name, surname, password, date_of_birth, profile_picture->[./users/${id}/profile.jpg/]

// Posts -> date_of_creation, title, body, comments, creator
    // Type: text, text+image, etc.
