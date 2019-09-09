const configTags = server => {
  server.get('tags', () => {
    return [];
  });

  server.post('tags', () => {
    return [];
  });
};

export default configTags;
