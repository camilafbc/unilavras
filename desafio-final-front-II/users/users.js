const usersContainer = document.getElementById('users-container');

async function getUsers() {
  const response = await fetch('https://dummyjson.com/users');
  const data = await response.json();

  data.users.forEach(user => { 
    const card = generateUserCard( 
      user.id, user.firstName, 
      user.maidenName, 
      user.lastName, 
      user.email, 
      user.age, 
      user.gender 
    );

    usersContainer.innerHTML += card 
  });


  // ScrollReveal:
  ScrollReveal().reveal('.card', {
    reset: false,
    duration: 800,
    distance: '40px',
    origin: 'bottom',
    interval: 100
  });
}

getUsers();



function generateUserCard(id, name, maidenName, lastName , email, idade, gender){

  let surname = maidenName !== "" ? maidenName : ""
  lastName !== "" ? surname += " " + lastName : surname

  return `
  <div class="card" id="user-${id}">
          <div class="card-img-container">
            <img
              src="${gender === "female" ? '../assets/images/female_user.png' : '../assets/images/male_user.png'}"
              alt=""
              srcset=""
            />
          </div>
          <div class="card-text-container">
            <p>${name} ${surname}</p>
            <p>
              ${email}
            </p>
            <p>${idade} anos</p>
          </div>
          <div class="card-hover">
            <button onclick="handleDelete(${id})">Excluir</button>
          </div>
        </div>
  `
}

async function handleDelete(userId) {
  Swal.fire({
    title: "Tem certeza que deseja excluir esse usuário?",
    showCancelButton: true,
    confirmButtonText: "Sim",
    cancelButtonText: "Cancelar"
  }).then(async (result) => {
    
    if (result.isConfirmed) {

      
      const response = await fetch(`https://dummyjson.com/users/${userId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      console.log("DELETE RESPONSE:", data);

      
      if (data.isDeleted) {
        document.getElementById(`user-${userId}`).remove();

        Swal.fire("Usuário excluído com sucesso!", "", "success");
      } else {
        Swal.fire("Erro ao excluir!", "Tente novamente.", "error");
      }
    }
  });
}

// Abre modal SweetAlert2 para adicionar produto (com labels e validações)
function openAddUserModal() {
  Swal.fire({
    title: 'Adicionar novo usuário',
    html: `
    <div style="text-align:left; width:100%; display:flex; flex-direction:column; gap:1rem; align-items:stretch;">

      <div style="display:flex; flex-direction:column; gap:0.25rem">
        <label for="swal-firstName">Nome</label>
        <input id="swal-firstName" class="swal2-input" style="margin:0; width:100%;" placeholder="Nome">
      </div>

      <div style="display:flex; flex-direction:column; gap:0.25rem">
        <label for="swal-lastName">Sobrenome</label>
        <input id="swal-lastName" class="swal2-input" style="margin:0; width:100%;" placeholder="Sobrenome">
      </div>

      <div style="display:flex; flex-direction:column; gap:0.25rem">
        <label for="swal-email">E-mail</label>
        <input id="swal-email" class="swal2-input" style="margin:0; width:100%;" placeholder="E-mail">
      </div>

      <div style="display:flex; flex-direction:column; gap:0.25rem">
        <label for="swal-age">Idade</label>
        <input id="swal-age" type="number" min="0" max="120" step="1" class="swal2-input" style="margin:0; width:100%;" placeholder="0">
      </div>

      <div style="display:flex; flex-direction:column; gap:0.5rem;">
        <label for="swal-gender">Gênero</label>
        <select id="swal-gender" class="swal2-input" style="height:3rem;">
          <option value="">Selecione...</option>
          <option value="female">Feminino</option>
          <option value="male">Masculino</option>
        </select>
      </div>

    </div>
  `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'Salvar',
    cancelButtonText: 'Cancelar',
    preConfirm: () => {
      const firstName = document.getElementById('swal-firstName').value.trim();
      const lastName = document.getElementById('swal-lastName').value.trim();
      const email = document.getElementById('swal-email').value.trim();
      const ageRaw = document.getElementById('swal-age').value;
      const age = ageRaw === '' ? NaN : parseInt(ageRaw);
      const gender = document.getElementById('swal-gender').value;

      // Validações:
      const lenOk = (s) => typeof s === 'string' && s.length >= 3 && s.length <= 50;

      if (!lenOk(firstName)) {
        Swal.showValidationMessage('Nome obrigatório: 3–50 caracteres');
        return false;
      }

      if (!lenOk(lastName)) {
        Swal.showValidationMessage('Sobrenome obrigatório: 3–50 caracteres');
        return false;
      }

      // Validação de idade
      if (isNaN(age) || !isFinite(age)) {
        Swal.showValidationMessage('Idade inválida: informe um número entre 0 e 120');
        return false;
      }

      if (age < 0 || age > 120) {
        Swal.showValidationMessage('Idade deve estar entre 0 e 120');
        return false;
      }

      // Gênero obrigatório e aceitar apenas female ou male para envio
      if (!(gender === 'female' || gender === 'male')) {
        Swal.showValidationMessage('Gênero obrigatório: selecione Feminino ou Masculino');
        return false;
      }

      // Validação de email
      const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      if (!emailRegex.test(email)) {
        Swal.showValidationMessage('E-mail inválido');
        return false;
      }

      return {
        firstName,
        lastName,
        email,
        age,
        gender
      };
    }
  }).then((result) => {
    if (result.isConfirmed && result.value) {
      submitNewUser(result.value);
    }
  });
}

// Envia o novo usuário para a API e insere no DOM
async function submitNewUser(values) {
  try {
    const bodyPayload = {
      firstName: values.firstName,
      lastName: values.lastName,
      age: values.age,
      gender: values.gender,
      email: values.email
    };

    const response = await fetch('https://dummyjson.com/users/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyPayload)
    });

    const data = await response.json();
    console.log('ADD USER RESPONSE:', data);

    if (data && data.id) {
      // Insere o novo card no topo da lista
      const card = generateUserCard(
        data.id,
        data.firstName,
        data.maidenName || '',
        data.lastName || '',
        data.email,
        data.age,
        data.gender
      );

      if (usersContainer) {
        usersContainer.insertAdjacentHTML('afterbegin', card);
      }

      Swal.fire('Usuário criado!', '', 'success');
    } else {
      Swal.fire('Erro ao criar usuário', 'Tente novamente.', 'error');
    }
  } catch (err) {
    console.error(err);
    Swal.fire('Erro', 'Ocorreu um erro ao conectar com a API.', 'error');
  }
}