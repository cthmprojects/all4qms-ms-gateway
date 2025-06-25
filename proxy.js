const express = require('express');
const axios = require('axios');
const url = require('url');
const https = require('https');

const PORT = process.env.PROXY_PORT || 3000; // Porta em que o servidor proxy vai rodar
const GATEWAY_URL = process.env.GATEWAY_URL || 'https://all4qms-gateway.vdeveloper.com.br'; // URL do gateway
const GATEWAY_HOST = process.env.GATEWAY_HOST || 'all4qms-gateway.vdeveloper.com.br'; // Host do gateway

const app = express();

// Middleware para fazer o parsing do corpo da requisição como JSON
app.use(express.json());

// Configuração para ignorar a verificação do certificado SSL
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Middleware para lidar com CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Define a origem permitida como qualquer origem (para fins de desenvolvimento)
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Define os métodos HTTP permitidos
  res.setHeader('Access-Control-Allow-Headers', '*'); // Define os headers permitidos
  res.setHeader('Access-Control-Expose-Headers', '*'); // Define quais headers serão expostos para o axios
  next();
});

// Headers sensíveis, como Authorization, podem não ser expostos automaticamente em respostas CORS por motivos de segurança. Nesses casos, o navegador pode omitir esses headers do objeto de resposta que é acessível pelo JavaScript.
// Solução: Verifique as configurações de CORS no servidor para permitir a exposição do header Authorization. Certifique-se de que o servidor está configurado para incluir o header Access-Control-Expose-Headers com o nome do header que você deseja expor, por exemplo:

// Rota para lidar com requisições
app.use('*', (req, res) => {
  // Parse a URL da requisição original

  req.method == 'OPTIONS' && res.status(200).send();

  // Configuração para a requisição ao servidor verdadeiro
  if (req.method !== 'OPTIONS') {
    const axiosConfig = {
      method: req.method.toLowerCase(),
      url: `${GATEWAY_URL}${req.originalUrl}`,
      headers: {
        host: GATEWAY_HOST, // Define o header 'Host' com o servidor destino
        origin: GATEWAY_URL, // Define o header 'Origin' com base na origem da requisição
        referer: GATEWAY_URL, // Define o header 'Referer' com base no referer da requisição
      },
      /* httpsAgent: new https.Agent({ rejectUnauthorized: false }), // Configuração do agente HTTPS para ignorar a verificação do certificado SSL
      validateStatus: false, // Para lidar com códigos de status de resposta personalizados
      adapter: axiosBrotliAdapter, */
      ...(req.body ? { data: req.body } : {}),
    };

    if (req.headers.authorization) {
      axiosConfig.headers = {
        authorization: req.headers.authorization,
      };
    }

    // Faz a requisição usando Axios
    axios(axiosConfig)
      .then(async response => {
        // Log da resposta do servidor destino
        // console.log(`Status code: ${response.status}`);
        // console.log(`Headers: ${JSON.stringify(response.headers)}`);
        // console.log(`Body: ${JSON.stringify(response.data)}`); // Log do corpo da resposta
        // console.log(brotli.decompress(response.data));
        for (const key in response.headers) {
          console.log(key);
          res.setHeader(key, response.headers[key]);
        }
        // Retorna a resposta do servidor destino para o cliente
        res.status(response.status).json(response.data);
      })
      .catch(error => {
        console.error(`Erro ao tentar realizar a requisição: ${error.message}`);
        res.status(500).json({ error: 'Erro interno no servidor' });
      });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor Express rodando na porta ${PORT}`);
  console.log(`Proxy configurado para: ${GATEWAY_URL}`);
  console.log(`Host configurado para: ${GATEWAY_HOST}`);
});
