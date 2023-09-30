const fs = require('fs');
const readline = require('readline');

const contactsFile = 'contacts.dat';

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
    fs.readFile(contactsFile, (err, data) => {
        let contacts = [];

        if (!err) {
            try {
                contacts = JSON.parse(data);
            } catch (error) {
                console.error('Erro ao ler o arquivo de contatos:', error);
            }
        }

        contacts.push(contact);

        fs.writeFile(contactsFile, JSON.stringify(contacts), (err) => {
            if (err) {
                console.error('Erro ao salvar o contato:', err);
            } else {
                console.log('Contato salvo com sucesso!');
            }
        });
    });
}

// Função para listar todos os contatos
function listContacts() {
    fs.readFile(contactsFile, (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo de contatos:', err);
            return;
        }

        const contacts = JSON.parse(data);

        if (contacts.length === 0) {
            console.log('Nenhum contato encontrado.');
        } else {
            console.log('Lista de contatos:');
            contacts.forEach((contact, index) => {
                console.log(`${index + 1}. Nome: ${contact.name}, Telefone: ${contact.phone}, E-mail: ${contact.email}`);
            });
        }
    });
}

// Menu de opções
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

// Inicialização do programa
fs.access(contactsFile, fs.constants.F_OK, (err) => {
    if (err) {
        // O arquivo de contatos não existe, cria-se um arquivo vazio
        fs.writeFile(contactsFile, '[]', (err) => {
            if (err) {
                console.error('Erro ao criar o arquivo de contatos:', err);
            } else {
                console.log('Arquivo de contatos criado com sucesso.');
                showMenu();
            }
        });
    } else {
        // O arquivo de contatos já existe, exibe o menu
        showMenu();
    }
});
