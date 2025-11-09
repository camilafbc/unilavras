
const age = document.getElementById('age');
const form = document.getElementById('form');

const data_json = [];

age.addEventListener('input', (e) => {
  e.target.value = e.target.value.replace(/\D/g, '')
});


function validateEmail(value) {
  const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(value)
};


function setErrorMsg(id, msg) {
  const element = document.getElementById(id);
  element.textContent = msg
}


form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries())

  if (data.name.length < 3 || data.name.length > 50) {
    setErrorMsg('nameMsg', "Mínimo 3 e máximo 50 caracteres.");
    return
  };

  if (data.surname.length < 3 || data.surname.length > 50) {
    setErrorMsg('surnameMsg', "Mínimo 3 e máximo 50 caracteres.");
    return
  };
  
  if (isNaN(parseInt(data.age))){
    setErrorMsg('ageMsg', "Insira um número válido!");
    return
  } else if (parseInt(data.age) > 120) {
    setErrorMsg('ageMsg', "Insira um número entre 0 e 120.");
    return
  };

  if (!validateEmail(data.email)){
    setErrorMsg('emailMsg', "E-mail inválido!");
    return
  };

  if (data.message.length === ""){
    setErrorMsg('textMsg', "Insira uma mensagem.");
    return
  };
  
  Swal.fire({
  title: "Confirmar e enviar?",
  html: `
    <div style="display: flex; flex-direction: column; align-items: start">
      <div><strong>Nome: </strong> <span>${data.name}</span></div>\n
      <div><strong>Sobrenome: </strong> <span>${data.surname}</span></div>\n
      <div><strong>Idade: </strong> <span>${data.age}</span></div>\n
      <div><strong>E-mail: </strong> <span>${data.email}</span></div>\n
      <div><strong>Mensagem: </strong> <span>${data.message}</span></div>\n
    </div>
  `,
  showCancelButton: true,
  confirmButtonText: "Enviar",
  cancelButtonText: "Cancelar"
  }).then((result) => {
    if (result.isConfirmed) {
      data_json.push(data)
      console.log("Dados recebidos: ")
      console.log(data_json)
      Swal.fire("Dados enviados com sucesso!", "", "success");
      setTimeout(() => window.location.replace('index.html'), 3 * 1000)
    } 
  });

})