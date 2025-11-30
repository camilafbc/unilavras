const newProductsContainer = document.getElementById('main-new-products-container');
const accessoriesProductContainer = document.getElementById('main-accessories-products-container');

async function getProducts() {

  const [smartphones,accessories] = await Promise.all([
    fetch('https://dummyjson.com/products/category/smartphones?limit=4').then(response => response.json()),
    fetch('https://dummyjson.com/products/category/mobile-accessories?limit=10').then(response => response.json()),
  ])

  smartphones.products.forEach(product => {
    const card = generateProductCard(
      product.id,
      product.title,
      product.description,
      product.price,
      product.brand,
      product.category,
      product?.images[0]
    )

    newProductsContainer.innerHTML += card;
  });

  accessories.products.forEach(product => {
    const card = generateProductCard(
      product.id,
      product.title,
      product.description,
      product.price,
      product.brand,
      product.category,
      product?.images[0]
    )

    accessoriesProductContainer.innerHTML += card;
  });
  
  // ScrollReveal:
  ScrollReveal().reveal('.card', {
    reset: false,
    duration: 800,
    distance: '40px',
    origin: 'bottom',
    interval: 100
  });
  
};

getProducts()

export function generateProductCard(id, titulo, descricao, preco, marca, categoria, imagem){
  return `
  <div class="card product-card" id="product-${id}">
          <div class="card-img-container">
            <img
              src="${imagem}"
              alt=""
              srcset=""
            />
          </div>
          <div class="card-badges-container">
            <div class="badge">${categoria}</div>
            <div class="badge">${marca}</div>
          </div>
          <div class="card-text-container">
            <p>${titulo}</p>
            <p>
              ${descricao}
            </p>
            <p>R$ ${preco}</p>
          </div>
          <div class="card-hover">
            <button onclick="handleDelete(${id})">Excluir</button>
          </div>
        </div>
  `
};