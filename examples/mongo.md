```js
// FIND
db.Clients.find({ industry: 'Automotive' });
db.Clients.find({ $where: function() { return this.industry ==  'Automotive' } })

// SELECT & JOIN
db.Projects.find({ clientId: {
   $in: db.Clients.find({ countryId: 'AU' }).map(x => x._id)
}}, { _id: 1, name: 1, budget: 1 })

const clients = db.Clients
   .find({ countryId: 'IE' })
   .map( x => x._id )
db.Projects
   .find({ clientId: {$in: clients} }, { _id: 0, name:1 })
   .sort({ name: 1 })

// INSERT
const clients = [...];
clients.forEach( client => {
    client._id = ObjectId().str;
    db.Clients.insert( client );
});

db.ClientsXX.find({}).forEach(x => {
    const xNew = Object.assign({}, x, {_id: x._id.valueOf(), leads: [], planners: []});
    db.getCollection('Clients').insert( xNew );
});

// UPDATE (the first match)
db.Formats.update({ countryId: 'GB' },
   {
      $set: {
         parentId: null
      }
   }
)
db.Formats.updateMany({ countryId: 'GB' },
   {
      $set: {
         parentId: null
      }
   }
)

db.Formats.updateMany({},
   {
      $unset: { parentId:1 }
   }, false, true
);
```

[Node](/examples/node.md)
