import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';

const IndexPage = () => {
  const {
    apod: { id, date, explanation, media_type, service_version, title, image }
  } = useStaticQuery(graphql`
    query {
      apod {
        id
        date
        explanation
        media_type
        service_version
        title
        image {
          url {
            childImageSharp {
              gatsbyImageData
            }
          }
        }
      }
    }
  `);

  return (
    <main>
      <p>{date}</p>
      <h1>{title}</h1>
      <p>{explanation}</p>
      <GatsbyImage alt={title} image={getImage(image.url)} />
      <p>{`id: ${id}`}</p>
      <p>{`media_type: ${media_type}`}</p>
      <p>{`service_version: ${service_version}`}</p>
    </main>
  );
};

export default IndexPage;
