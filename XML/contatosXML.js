const fs = require('fs');
const readline = require('readline');
const { parseString, Builder } = require('xml2js');

const contactsFile = 'contacts.xml';

function addContact() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Nome: ', (name) => {
    rl.question('Número de telefone: ', (phone) => {
      rl.question('E-mail: ', (email) => {
        const contact = { name, phone, email };
        saveContact(contact);
        rl.close();
      });
    });
  });
}

function saveContact(contact) {
  fs.readFile(contactsFile, 'utf8', (err, data) => {
    let contacts = [];

    if (!err) {
      try {
        parseString(data, (err, result) => {
          if (!err && result.contacts && result.contacts.contact) {
            contacts = result.contacts.contact;
          }
        });
      } catch (error) {
        console.error('Erro ao ler o arquivo de contatos:', error);
      }
    }

    contacts.push(contact);

    const xmlBuilder = new Builder();
    const xml = xmlBuilder.buildObject({ contacts: { contact: contacts } });

    fs.writeFile(contactsFile, xml, 'utf8', (err) => {
      if (err) {
        console.error('Erro ao salvar o contato:', err);
      } else {
        console.log('Contato salvo com sucesso!');
      }
    });
  });
}

function listContacts() {
  fs.readFile(contactsFile, 'utf8', (err, data) => {
    if (err) {
      console.error('Erro ao ler o arquivo de contatos:', err);
      return;
    }

    parseString(data, (err, result) => {
      if (!err && result.contacts && result.contacts.contact) {
        const contacts = result.contacts.contact;

        if (contacts.length === 0) {
          console.log('Nenhum contato encontrado.');
        } else {
          console.log('Lista de contatos:');
          contacts.forEach((contact, index) => {
            console.log(`${index + 1}. Nome: ${contact.name}, Telefone: ${contact.phone}, E-mail: ${contact.email}`);
          });
        }
      } else {
        console.log('Nenhum contato encontrado.');
      }
    });
  });
}

function showMenu() {
  console.log('\nEscolha uma opção:');
  console.log('1. Adicionar novo contato');
  console.log('2. Listar contatos');
  console.log('3. Sair');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Opção: ', (option) => {
    if (option === '1') {
      addContact();
    } else if (option === '2') {
      listContacts();
    } else if (option === '3') {
      console.log('Saindo...');
      rl.close();
    } else {
      console.log('Opção inválida.');
    }
  });
}

fs.access(contactsFile, fs.constants.F_OK, (err) => {
  if (err) {
    fs.writeFile(contactsFile, '<contacts></contacts>', 'utf8', (err) => {
      if (err) {
        console.error('Erro ao criar o arquivo de contatos:', err);
      } else {
        console.log('Arquivo de contatos criado com sucesso.');
        showMenu();
      }
    });
  } else {
    showMenu();
  }
});
