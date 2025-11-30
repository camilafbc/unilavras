const productsContainer = document.getElementById('products-container');

async function getProducts() {
  const [smartphones, accessories] = await Promise.all([
    fetch('https://dummyjson.com/products/category/smartphones?limit=10').then(response => response.json()),
    fetch('https://dummyjson.com/products/category/mobile-accessories?limit=20').then(response => response.json()),
  ]);

  const allProducts = [
  ...smartphones.products,
  ...accessories.products
];

  allProducts.forEach(product => {
    const card = generateProductCard(
      product.id,
      product.title,
      product.description,
      product.price,
      product.brand,
      product.category,
      product?.images[0]
    )

    productsContainer.innerHTML += card;
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

function generateProductCard(id, titulo, descricao, preco, marca, categoria, imagem){
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

async function handleDelete(productId) {
  Swal.fire({
    title: "Tem certeza que deseja excluir esse produto?",
    showCancelButton: true,
    confirmButtonText: "Sim",
    cancelButtonText: "Cancelar"
  }).then(async (result) => {
    
    if (result.isConfirmed) {

      // Aguarda o DELETE de verdade (mesmo que seja fake)
      const response = await fetch(`https://dummyjson.com/products/${productId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      console.log("DELETE RESPONSE:", data);

      // Agora sim verifica
      if (data.isDeleted) {
        document.getElementById(`product-${productId}`).remove();

        Swal.fire("Produto excluído com sucesso!", "", "success");
      } else {
        Swal.fire("Erro ao excluir!", "Tente novamente.", "error");
      }
    }
  });

  
};

// Abre modal SweetAlert2 para adicionar produto
function openAddProductModal() {
  Swal.fire({
    title: 'Adicionar novo produto',
    html: `
    <div style="text-align:left; width:100%; display:flex; flex-direction:column; gap:1rem; align-items:stretch;">

      <div style="display:flex; flex-direction:column; gap:0.25rem">
        <label for="swal-title">Título</label>
        <input id="swal-title" class="swal2-input" style="margin:0; width:100%;" placeholder="Título">
      </div>

      <div style="display:flex; flex-direction:column; gap:0.25rem">
        <label for="swal-description">Descrição</label>
        <textarea id="swal-description" class="swal2-textarea" style="margin:0; width:100%;" placeholder="Descrição"></textarea>
      </div>

      <div style="display:flex; flex-direction:column; gap:0.25rem">
        <label for="swal-brand">Marca</label>
        <input id="swal-brand" class="swal2-input" style="margin:0; width:100%;" placeholder="Marca">
      </div>

      <div style="display:flex; flex-direction:column; gap:0.25rem">
        <label for="swal-category">Categoria</label>
        <input id="swal-category" class="swal2-input" style="margin:0; width:100%;" placeholder="Categoria">
      </div>

      <div style="display:flex; flex-direction:column; gap:0.25rem">
        <label for="swal-price">Preço (R$)</label>
        <input id="swal-price" type="number" min="0" max="120" step="0.01" class="swal2-input" style="margin:0; width:100%;" placeholder="0.00">
      </div>

      <div style="display:flex; flex-direction:column; gap:0.25rem">
        <label for="swal-image">Imagem (URL)</label>
        <input id="swal-image" class="swal2-input" style="margin:0; width:100%;" placeholder="https://... (opcional)">
      </div>

    </div>
  `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'Salvar',
    cancelButtonText: 'Cancelar',
    preConfirm: () => {
      const title = document.getElementById('swal-title').value.trim();
      const brand = document.getElementById('swal-brand').value.trim();
      const category = document.getElementById('swal-category').value.trim();
      const priceRaw = document.getElementById('swal-price').value;
      const price = priceRaw === '' ? NaN : parseFloat(priceRaw);
      const image = document.getElementById('swal-image').value.trim();
      const description = document.getElementById('swal-description').value.trim();

      // Validações:
      const lenOk = (s) => typeof s === 'string' && s.length >= 3 && s.length <= 50;

      if (!lenOk(title)) {
        Swal.showValidationMessage('Título obrigatório: 3–50 caracteres');
        return false;
      }

      if (!lenOk(description)) {
        Swal.showValidationMessage('Descrição obrigatória: 3–50 caracteres');
        return false;
      }

      if (!lenOk(brand)) {
        Swal.showValidationMessage('Marca obrigatória: 3–50 caracteres');
        return false;
      }

      if (!lenOk(category)) {
        Swal.showValidationMessage('Categoria obrigatória: 3–50 caracteres');
        return false;
      }

      if (isNaN(price) || !isFinite(price)) {
        Swal.showValidationMessage('Preço inválido: informe um número entre 0 e 120');
        return false;
      }

      if (price < 0 || price > 120) {
        Swal.showValidationMessage('Preço deve estar entre 0 e 120');
        return false;
      }

      if (image) {
        try {
          // valida URL
          new URL(image);
        } catch (e) {
          Swal.showValidationMessage('URL da imagem inválida');
          return false;
        }
      }

      return {
        title,
        brand,
        category,
        price: Math.round(price * 100) / 100,
        image,
        description
      };
    }
  }).then((result) => {
    if (result.isConfirmed && result.value) {
      submitNewProduct(result.value);
    }
  });
}

// Envia o novo produto para a API e insere no DOM
async function submitNewProduct(values) {
  try {
    const bodyPayload = {
      title: values.title,
      description: values.description,
      price: values.price,
      brand: values.brand,
      category: values.category,
      images: values.image ? [values.image] : []
    };

    const response = await fetch('https://dummyjson.com/products/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyPayload)
    });

    const data = await response.json();
    console.log('ADD RESPONSE:', data);

    if (data && data.id) {
      // Insere o novo card no topo da lista
      const card = generateProductCard(
        data.id,
        data.title,
        data.description,
        data.price,
        data.brand,
        data.category,
        data.images && data.images[0]
      );

      if (productsContainer) {
        productsContainer.insertAdjacentHTML('afterbegin', card);
      }

      Swal.fire('Produto criado!', '', 'success');
    } else {
      Swal.fire('Erro ao criar produto', 'Tente novamente.', 'error');
    }
  } catch (err) {
    console.error(err);
    Swal.fire('Erro', 'Ocorreu um erro ao conectar com a API.', 'error');
  }
}