const fs = require("fs");

class ProductManager {
  #path = "./Productos.json";
  #amount = 0;

  async addProduct(title, description, price, thumbnail, code, stock) {
    // Recupero los productos
    const products = await this.getProducts();
    //console.log("PROD: " + JSON.stringify(products));
    // Verifico si hay un producto con ese CODE
    let verifyCode = products.find((p) => p.code === code);
    if (!verifyCode) {
      // Construyo el nuevo Producto
      const newProduct = {
        id: this.#amount,
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
      };
      try {
        const updatedProducts = [...products, newProduct];
        // console.log("Updated: " + updatedProducts);
        fs.promises.writeFile(this.#path, JSON.stringify(updatedProducts));
        this.#amount++;
      } catch (err) {
        console.error(err);
      }
    } else {
      //throw new Error(`El código ${code} ya esta registrado.`);
      console.error(`El código ${code} ya esta registrado.`);
    }
  }

  async getProducts() {
    try {
      const products = await fs.promises.readFile(this.#path, "utf-8");
      return JSON.parse(products);
    } catch (e) {
      return [];
    }
  }

  async getProductById(id) {
    const products = await this.getProducts();
    let verifyProduct = products.find((p) => p.id === id);
    if (verifyProduct) {
      return verifyProduct;
    } else {
      return `No existe un producto con ID: ${id}`;
    }
  }

  async updateProduct(id, title, description, price, thumbnail, code, stock) {
    // defino un arreglo vacío
    let products = [];
    // llamo al método getProducts
    const productsPromise = await this.getProducts();
    // vuelvo a armar mi arreglo
    productsPromise.forEach((oneProd) => {
      products.push(oneProd);
    });
    // Verifico el campo ID de cada producto existe en el arreglo
    products.forEach((oneProd) => {
      const verifyProduct = oneProd.id === id;
      try {
        if (verifyProduct) {
          const updatedProduct = {
            id,
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
          };
          let allButOne = [];
          products.forEach((oneProd) => {
            if (oneProd.id != id) {
              allButOne.push(oneProd);
            } else {
              allButOne.push(updatedProduct);
            }
          });
          // Grabo el archivo con los productos actualizados
          fs.promises.writeFile(this.#path, JSON.stringify(allButOne));
        }
      } catch (err) {
        console.error(err);
      }
    });
  }

  async deleteProduct(id) {
    // defino un arreglo vacío
    let products = [];
    // llamo al método getProducts
    const productsPromise = await this.getProducts();
    // vuelvo a armar mi arreglo
    productsPromise.forEach((oneProd) => {
      products.push(oneProd);
    });
    // Verifico el campo ID de cada producto existe en el arreglo
    let allExceptOne = [];
    products.forEach((oneProd) => {
      if (oneProd.id != id) {
        allExceptOne.push(oneProd);
      }
    });
    try {
      await fs.promises.writeFile(
        "./Productos.json",
        JSON.stringify(allExceptOne)
      );
    } catch (err) {
      console.error(err);
    }
  }
}

async function main() {
  // Instancio un objeto de la clase
  const manager = new ProductManager();
  // Muestro los Productos existentes
  console.log(await manager.getProducts());
  // Creo el primer Producto
  await manager.addProduct(
    "producto prueba",
    "Este es un producto prueba",
    200,
    "Sin imagen",
    "abc101",
    25
  );
  // Creo un segundo Producto
  await manager.addProduct(
    "segundo producto",
    "Este es otro producto prueba",
    300,
    "foto2",
    "abc102",
    35
  );
  // Muestro los Productos existentes
  console.log(await manager.getProducts());
  // Busco un producto por su ID
  console.log(await manager.getProductById(0));
  // Intento crear un Producto con un CODE repetido
  await manager.addProduct(
    "tercer producto",
    "Este es otro producto prueba",
    300,
    "foto2",
    "abc102",
    35
  );
  // Actualizo un Producto existente
  await manager.updateProduct(
    1,
    "TítuloActualizado",
    "DescripciónAcualizada",
    500,
    "FOTOActualizada",
    "abc102",
    44
  );
  // Muestro los Productos existentes
  console.log(await manager.getProducts());
  // Borro un producto
  await manager.deleteProduct(0);
  // Muestro los Productos existentes
  console.log(await manager.getProducts());
}

main();
