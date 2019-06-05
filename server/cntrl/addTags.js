module.exports = {
  addTags: (req, res) => {
    const db = req.app.get('db');
    db.addTag(req.body.tag, req.body.id).then(response => {
      db.getData().then(response2 => {
        var groups = {};
        for (var i = 0; i < response2.length; i++) {
          var groupName = response2[i].id;
          if (!groups[groupName]) {
            groups[groupName] = [];
          }
          groups[groupName].push(response2[i].tag);
        }
        console.log(groups);

        myArray = [];
        for (var groupName in groups) {
          myArray.push({
            id: groupName,
            tag: groups[groupName]
          });
        }
        res.status(200).json(myArray);
      });
    });
  },
  getTags: (req, res) => {
    const db = req.app.get('db');
    db.getData().then(response2 => {
      var groups = {};
      for (var i = 0; i < response2.length; i++) {
        var groupName = response2[i].id;
        if (!groups[groupName]) {
          groups[groupName] = [];
        }
        groups[groupName].push(response2[i].tag);
      }
      console.log(groups);

      myArray = [];
      for (var groupName in groups) {
        myArray.push({
          id: groupName,
          tag: groups[groupName]
        });
      }
      res.status(200).json(myArray);
    });
  },
  deleteTag: (req, res) => {
    const db = req.app.get('db');
    console.log(req.body.id, req.body.tag);

    db.deleteTag(+req.body.id, req.body.tag).then(response => {
      db.getData().then(response2 => {
        var groups = {};
        for (var i = 0; i < response2.length; i++) {
          var groupName = response2[i].id;
          if (!groups[groupName]) {
            groups[groupName] = [];
          }
          groups[groupName].push(response2[i].tag);
        }

        myArray = [];
        for (var groupName in groups) {
          myArray.push({
            id: groupName,
            tag: groups[groupName]
          });
        }
        res.status(200).json(myArray);
      });
    });
  }
};
