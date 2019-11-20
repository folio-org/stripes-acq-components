import { TAGS_API } from '../../../../lib';
import {
  createGetAll,
  createPost,
} from './utils';

const SCHEMA_NAME = 'tags';

const configTags = server => {
  server.get(TAGS_API, createGetAll(SCHEMA_NAME));
  server.post(TAGS_API, createPost(SCHEMA_NAME));
};

export default configTags;
