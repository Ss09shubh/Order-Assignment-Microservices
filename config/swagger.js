const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

// Configure Swagger UI options
const options = {
  swaggerOptions: {
    defaultModelsExpandDepth: -1, // Hide schema section
    docExpansion: 'list',         // Collapse tags by default
    persistAuthorization: true,
    displayRequestDuration: true,
    requestSnippetsEnabled: true,
    tryItOutEnabled: true,
    defaultModelRendering: 'example',
    showCommonExtensions: true
  },
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Order Processing Platform API'
};

module.exports = { 
  swaggerUi, 
  swaggerDocument,
  swaggerOptions: options
};