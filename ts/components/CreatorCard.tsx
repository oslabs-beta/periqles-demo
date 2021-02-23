import * as React from 'react';

interface CreatorCardProps {
  key: number;
  author: {
    img: string;
    name: string;
    link: string;
  }
}

const CreatorCard = ({author}: CreatorCardProps): JSX.Element => {
  const {img, name, link} = author;

  return (
    <p className="AuthorCard">
      {/* <img className="author-img" 
      src={img} 
      alt={name}
      width="75"></img> */}
      <a href={link} className="author-link">{name}</a>
    </p>
  );
};

export default CreatorCard;