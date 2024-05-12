import swaggerUi from 'swagger-ui-express';
import yaml from 'js-yaml';
import fs from 'fs';

const swaggerDocument = yaml.load(fs.readFileSync('./docs/swagger.yaml', 'utf8'));

export default (app: any) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};