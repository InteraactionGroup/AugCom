# Database tutorial


For this tutorial, I use AugCom as an example source and the google chrome browser. To see the database, right click then "inspect" or press F12. Choose Appli in the top tabs.

![appli](src/assets/tuto/Appli.png)

Then in storage unfold indexed database, and you will find the AugCom database and its different tables and their data.

![stockage](src/assets/tuto/Stockage.png)

the key "1" in AugCom is the default user key with all default settings (configuration, grid, color palette).

This database, if you decide to delete it from the browser, will automatically reformat itself when you refresh the AugCom application page with the default values, so you will lose all other users, grids etc...

The first thing you have to do for each operation on the database is to make an opening query like this:
```ts
this.openRequest = indexedDB.open('saveAugcom', 1);

      // ERROR
      this.openRequest.onerror = event => {
        alert('Database error: ' + event.target.errorCode);
      };

      // SUCCESS
      this.openRequest.onsuccess = event => {
```

## Add a table to the database

To add a table you just have to use the event to target the database then use the createObjectStore() function which is present in angular without package and indicate the name of the table here 'Palette' and put in auto-increment.
```ts
const transaction = event.target.transaction;
```

## Add/modify/delete data in a table

To add data in a table, you have to use the event to make a transaction.
```ts
const db = event.target.result;
db.createObjectStore('Palette', {autoIncrement: true});
```

Then, if you want to add a data in the table you have to use 'add' by giving the data as argument, even if 'put' works the same way, but it targets a key (here the 2nd argument is the key). If it exists, it will modify the content of this key, otherwise it adds a row with the key and the data.
To delete a line you just have to use "delete" giving as argument the key of the data to delete.
```ts
const paletteObjectStore = transaction.objectStore('Palette');

paletteObjectStore.add(this.paletteService.palettes);
paletteObjectStore.put(this.paletteService.palettes, this.userPageService.currentUser.id);
paletteObjectStore.delete(this.userPageService.currentUser.id);
```
