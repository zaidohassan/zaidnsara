SELECT p.id, p.pic, p.keys, t.tag 
FROM pictures p 
JOIN tags t 
ON p.id = t.tagid