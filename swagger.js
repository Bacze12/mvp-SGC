import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SGC Backend API',
      version: '1.0.0',
    },
  },
  apis: ['./src/routes/*.ts'], // Ruta a tus archivos de rutas
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
