import * as path from 'path';
import moduleAlias from 'module-alias';

const files = path.resolve(__dirname, '../..');

// add apelido aos caminhos, facilita nos imports
moduleAlias.addAliases({
  '@src': path.join(files, 'src'),
  '@teste': path.join(files, 'teste'),
});
