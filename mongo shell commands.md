<pre>
show dbs/collections

use <i>db_name</i>

db.<i>collection name</i>.find()

db.<i>collection name</i>.remove( {"username":"testuser"})
</pre>
```
use gunnbiz
db.users.find()
db.users.remove({ studentID: ########})
db.users.update({ studentID: ########}, {$set:{isAdmin:true}}, {upsert: true} )
```
