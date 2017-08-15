import R from 'ramda';
import * as XP from 'xod-project';
import * as XF from 'xod-func-tools';

import { def } from './types';

export const convertProjectToProjectFileContents = def(
  'convertProjectToProjectFileContents :: Project -> ProjectFileContents',
  R.compose(
    R.dissoc('patches'),
    R.dissoc('impls'),
    R.dissoc('attachments')
  )
);

export const convertProjectFileContentsToProject = def(
  'convertProjectFileContentsToProject :: ProjectFileContents -> Project',
  R.compose(
    R.assoc('patches', {}),
    R.assoc('attachments', []),
    R.assoc('impls', {})
  )
);

export const convertPatchToPatchFileContents = def(
  'convertPatchToPatchFileContents :: Patch -> PatchFileContents',
  R.compose(
    R.dissoc('attachments'),
    R.dissoc('impls'),
    R.dissoc('path'),
    R.evolve({
      nodes: R.values,
      links: R.values,
      comments: R.values,
    })
  )
);

export const convertPatchFileContentsToPatch = def(
  'convertPatchFileContentsToPatch :: PatchFileContents -> Patch',
  fsPatch => R.compose(
    XF.explodeEither,
    XP.upsertLinks(fsPatch.links),
    XP.upsertNodes(fsPatch.nodes),
    XP.upsertComments(fsPatch.comments),
    XP.setPatchDescription(fsPatch.description),
    XP.createPatch
  )()
);

const optionalPatchFields = {
  nodes: [],
  links: [],
  comments: [],
  description: '',
};

// TODO: keep DRY
export const addMissingOptionsToPatchFileContents = R.compose(
  R.evolve({
    nodes: R.map(XP.addMissingOptionalNodeFields),
    links: R.map(XP.addMissingOptionalLinkFields),
  }),
  R.merge(optionalPatchFields)
);

// TODO: keep DRY
export const omitDefaultOptionsFromPatchFileContents = R.compose(
  R.evolve({
    nodes: R.map(XP.omitEmptyOptionalNodeFields),
  }),
  XF.subtractObject(optionalPatchFields)
);

// TODO: Keep DRY
const OPTIONAL_PROJECT_FIELDS = {
  '@@type': 'xod-project/Project',
  description: '',
  license: '',
  version: '0.0.0',
  authors: [],
};

export const addMissingOptionsToProjectFileContents =
  R.merge(OPTIONAL_PROJECT_FIELDS);

export const omitDefaultOptionsFromProjectFileContents =
  XF.subtractObject(OPTIONAL_PROJECT_FIELDS);
