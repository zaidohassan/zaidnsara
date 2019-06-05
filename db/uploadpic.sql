INSERT INTO pictures(pic, keys)
VALUES ($1, $2)
RETURNING pic, id, keys;