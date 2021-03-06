import R from 'ramda';
import { expect } from 'chai';

import path from 'path';
import { loadLibs, loadAllLibs } from '../src/loadLibs';
import libsFixture from './fixtures/libs.json';

const workspaceDir = './fixtures/workspace';

describe('Library loader', () => {
  const workspace = path.resolve(__dirname, workspaceDir);

  it('should load xod/core libs from ./fixtures/workspace/lib', (done) => {
    const coreLibsOnly = R.omit(
      [
        'user/utils/test',
        'user/with-omitted-optionals/empty-lib-patch',
        'user/with-omitted-optionals/optional-node-fields-omitted',
        'xod/math/test',
      ],
      libsFixture
    );
    const nodeTypes = Object.assign({}, coreLibsOnly);
    delete nodeTypes['@/qux']; // lib loader don't know anything about patch nodes!

    loadLibs(['xod/core'], workspace)
      .then((data) => {
        expect(data).to.deep.equal(nodeTypes);
        done();
      })
      .catch(done);
  });

  it('should load all libs from ./fixtures/workspace/lib', (done) => {
    loadAllLibs(workspace)
      .then((data) => {
        expect(data).to.have.keys([
          'user/utils/test',
          'user/with-omitted-optionals/empty-lib-patch',
          'user/with-omitted-optionals/optional-node-fields-omitted',
          'xod/core/and',
          'xod/core/led',
          'xod/core/pot',
          'xod/core/test',
          'xod/math/test',
        ]);
        done();
      })
      .catch(done);
  });
});
