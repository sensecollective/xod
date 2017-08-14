import R from 'ramda';
import { subtractObject } from 'xod-func-tools';

import { def } from './types';

export const OPTIONAL_LINK_FIELDS = {
  '@@type': 'xod-project/Link',
};

export const OPTIONAL_NODE_FIELDS = {
  '@@type': 'xod-project/Node',
  boundValues: {},
  description: '',
  label: '',
};

export const OPTIONAL_PATCH_FIELDS = {
  '@@type': 'xod-project/Patch',
  attachments: [],
  description: '',
  impls: {},
  links: {},
  nodes: {},
  comments: {},
};

export const OPTIONAL_PROJECT_FIELDS = {
  '@@type': 'xod-project/Project',
  patches: {},
  authors: [],
  license: '', // MIT?
  version: '0.0.0',
  description: '',
};

export const addMissingOptionalLinkFields = R.merge(OPTIONAL_LINK_FIELDS);
export const addMissingOptionalNodeFields = R.merge(OPTIONAL_NODE_FIELDS);

export const addMissingOptionalPatchFields = R.compose(
  R.evolve({
    links: R.map(addMissingOptionalLinkFields),
    nodes: R.map(addMissingOptionalNodeFields),
  }),
  R.merge(OPTIONAL_PATCH_FIELDS)
);

export const addMissingOptionalProjectFields = R.compose(
  R.evolve({
    patches: R.map(addMissingOptionalPatchFields),
  }),
  R.merge(OPTIONAL_PROJECT_FIELDS)
);

export const omitEmptyOptionalLinkFields = def(
  'omitEmptyOptionalLinkFields :: Link -> Object',
  subtractObject(OPTIONAL_LINK_FIELDS)
);

export const omitEmptyOptionalNodeFields = def(
  'omitEmptyOptionalNodeFields :: Node -> Object',
  subtractObject(OPTIONAL_NODE_FIELDS)
);

export const omitEmptyOptionalPatchFields = def(
  'omitEmptyOptionalPatchFields :: Patch -> Object',
  R.compose(
    R.evolve({
      links: R.map(omitEmptyOptionalLinkFields),
      nodes: R.map(omitEmptyOptionalNodeFields),
    }),
    subtractObject(OPTIONAL_PATCH_FIELDS)
  )
);

export const omitEmptyOptionalProjectFields = def(
  'omitEmptyOptionalProjectFields :: Project -> Object',
  R.compose(
    R.evolve({
      patches: R.map(omitEmptyOptionalPatchFields),
    }),
    subtractObject(OPTIONAL_PROJECT_FIELDS)
  )
);
