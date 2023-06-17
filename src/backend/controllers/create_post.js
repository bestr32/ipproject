exports.create_post = (req, res) => {
    const post = {
        user_id: req.query.user_id,
        heading: req.query.heading,
        body: req.query.body,
        type: req.query.type,
    };

    if ((post.type === 'text') && post.body === undefined || post.body === '') {
        res.send('You cannot submit an empty post.');
        return;
    }

    let sql = 'INSERT INTO post SET ?';
    let query = connection.query(sql, post, (err, result) => {
        if (err) throw err;

        let insert_id = result.insertId;
        let file_path = `./fs/post/${result.insertId}/`;

        if (post.type === 'multimedia' || req.files) {
            console.log(req.files);
            let image = req.files.image;

            fs.mkdirSync(file_path, { recursive: true } , (err) => {
                if (err) throw err;
            });

            fs.writeFile(file_path + image.name, image.data, (err) => {
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

    res.send('Successfully submitted the post.');
};
