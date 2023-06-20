const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Configuração do servidor
const port = 3000;
const uploadDirectory = 'uploads/';

// Verifica se a pasta de upload existe, caso contrário, cria-a
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory);
}

// Rota principal para a página de upload
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota para lidar com o upload da foto
app.post('/upload', upload.single('photo'), (req, res) => {
  res.redirect('/');
});

// Rota para exibir as fotos no servidor
app.get('/photos', (req, res) => {
  fs.readdir(uploadDirectory, (err, files) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Erro ao listar as fotos');
    }

    // Monta a página HTML com as fotos listadas
    let html = '<h1>Fotos</h1>';

    files.forEach((file) => {
      const filePath = path.join(uploadDirectory, file);
      const downloadUrl = `/download?filename=${file}`;
      const deleteUrl = `/delete?filename=${file}`;
      html += `<div>
                  <img src="${filePath}" style="max-width: 300px;">
                  <div>
                    <a href="${downloadUrl}" download>Baixar</a>
                    <a href="${deleteUrl}">Excluir</a>
                  </div>
                </div>`;
    });

    res.send(html);
  });
});

// Rota para fazer o download de uma foto
app.get('/download', (req, res) => {
  const filename = req.query.filename;
  const filePath = path.join(uploadDirectory, filename);
  res.download(filePath);
});

// Rota para excluir uma foto
app.get('/delete', (req, res) => {
  const filename = req.query.filename;
  const filePath = path.join(uploadDirectory, filename);
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Erro ao excluir a foto');
    }
    res.redirect('/photos');
  });
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
