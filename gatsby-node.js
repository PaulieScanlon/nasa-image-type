require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`
});

const axios = require('axios');
const { createRemoteFileNode } = require('gatsby-source-filesystem');

exports.createSchemaCustomization = ({
  actions: { createTypes, printTypeDefinitions }
}) => {
  createTypes(`
    type apod implements Node {
      image: apodImage
    }
    type apodImage @dontInfer {
      url: File @link(by: "url")
    }
  `);
  // This is a dev thing, feel free to comment it out
  printTypeDefinitions({ path: './typeDefs.txt' });
};

exports.sourceNodes = async ({
  actions: { createNode },
  createNodeId,
  createContentDigest
}) => {
  const { data } = await axios.get(
    `https://api.nasa.gov/planetary/apod?api_key=${process.env.GATSBY_NASA_API_KEY}`
  );

  createNode({
    ...data,
    id: createNodeId(data.date),
    internal: {
      type: 'apod',
      contentDigest: createContentDigest(data)
    }
  });
};

exports.onCreateNode = async ({
  node,
  actions: { createNode },
  createNodeId,
  cache,
  store
}) => {
  if (node.internal.type === 'apod') {
    node.image = await createRemoteFileNode({
      url: node.url,
      parentNodeId: node.id,
      createNode,
      createNodeId,
      cache,
      store
    });
  }
};
