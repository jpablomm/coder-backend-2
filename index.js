const fs = require("fs");

class Contenedor {
  constructor(name) {
    this.name = name;
  }
  async save(item) {
    // read file
    let fileInfo = null;
    try {
      fileInfo = await fs.promises.readFile(this.name, "utf-8");
    } catch (error) {
      await fs.promises.writeFile(this.name, "[]");
      fileInfo = await fs.promises.readFile(this.name, "utf-8");
    }

    // parse to JavaScript object
    const fileObject = await JSON.parse(fileInfo);
    let last_id = 0;

    // get the highest id
    if (fileObject.length > 0) {
      for (let index = 0; index < fileObject.length; index++) {
        if (fileObject[index].id > last_id) {
          last_id = fileObject[index].id;
        }
      }
    }

    // add new item
    const newItem = {
      id: last_id + 1,
      title: item.title,
      price: item.price,
      thumbnail: item.thumbnail,
    };

    fileObject.push(newItem);

    await fs.promises.writeFile(this.name, JSON.stringify(fileObject));

    return newItem.id;
  }
  async getById(id) {
    // read file
    let fileInfo = null;
    try {
      fileInfo = await fs.promises.readFile(this.name, "utf-8");
    } catch (error) {
      console.log("There are no items in this file yet! Please add one.");
      console.log(error);
      return;
    }

    // parse to JavaScript object
    const fileObject = await JSON.parse(fileInfo);

    // find item with ID
    let result = fileObject.filter((item) => id == item.id);

    // print result
    console.log(result);

    return result;
  }

  async getAll() {
    // read file
    let fileInfo = null;
    try {
      fileInfo = await fs.promises.readFile(this.name, "utf-8");
    } catch (error) {
      console.log("There are no files with that name yet.");
      console.log(error);
      return;
    }

    // parse to JavaScript object
    const fileObject = await JSON.parse(fileInfo);

    // print result
    console.log(fileObject);

    return fileObject;
  }
  async deleteById(id) {
    // read file
    let fileInfo = null;
    try {
      fileInfo = await fs.promises.readFile(this.name, "utf-8");
    } catch (error) {
      console.log("There are no files with that name yet.");
      console.log(error);
      return;
    }

    // parse to JavaScript object
    const fileObject = await JSON.parse(fileInfo);

    // create new array with item with specified ID excluded
    let result = fileObject.filter((item) => id != item.id);

    // rewrite result
    await fs.promises.writeFile(this.name, JSON.stringify(result));

    // print result
    console.log(result);
    return;
  }
  async deleteAll() {
    await fs.promises.writeFile(this.name, "[]");
  }
}

// Create an instance of the container
const newContainer = new Contenedor("test.txt");

// TEST1: Add first item
newContainer.save({
  title: "pelota de futbol",
  price: 105,
  thumbnail: "http",
});

// TEST2: Add second item
// newContainer.save({
//   title: "pelota de basket",
//   price: 200,
//   thumbnail: "http",
// });

// TEST3: Get item by ID
// newContainer.getById(1);

// TEST4: Delete item by ID
// newContainer.deleteById(1);

// TEST5: Delete file
newContainer.deleteAll();
