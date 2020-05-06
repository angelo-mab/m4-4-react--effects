import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import useInterval from '../hooks/use-interval.hook';
import useDocumentTitle from '../hooks/use-document-title.hook';
import useKeydown from '../hooks/use-keydown.hook';

import Item from './Item';

import cookieSrc from '../cookie.svg';

const items = [
  { id: 'cursor', name: 'Cursor', cost: 10, value: 1 },
  { id: 'grandma', name: 'Grandma', cost: 100, value: 10 },
  { id: 'farm', name: 'Farm', cost: 1000, value: 100 },
];

const calculateCookiesPerTick = purchasedItems => {
  return Object.keys(purchasedItems).reduce((acc, itemId) => {
    const numOwned = purchasedItems[itemId];
    const item = items.find(item => item.id === itemId);
    const value = item.value;

    return acc + value * numOwned;
  })
}
const Game = () => {
  const [numCookies, setNumCookies] = useState(100);
  const [purchasedItems, setPurchasedItems] = useState({
    cursor: 0,
    grandma: 0,
    farm: 0,
  });

  const incrementCookies = () => {
    setNumCookies(c => c + 1);
  };

  useDocumentTitle({
    title: `${numCookies} cookies - Cookie Clicker Workshop`,
    fallbackTitle: 'Cookie Clicker Workshop',
  })

  useInterval(() => {
    const numOfGeneratedCookies = calculateCookiesPerTick(purchasedItems);
    setNumCookies(numCookies + numOfGeneratedCookies);
  }, 1000);

  useKeydown("Space", incrementCookies);

  return (
    <Wrapper>
      <GameArea>
        <Indicator>
          <Total>{numCookies} cookies</Total>
          <strong>{calculateCookiesPerTick(purchasedItems)}</strong> cookies per second
        </Indicator>
        <Button onClick={incrementCookies}>
          <Cookie src={cookieSrc} />
        </Button>
      </GameArea>

      <ItemArea>
        <SectionTitle>Items:</SectionTitle>
        {/* TODO: Add <Item> instances here, 1 for each item type. */}
        {items.map((item, index) => {
          return (
            <Item
              key={item.id}
              index={index}
              name={item.name}
              cost={item.cost}
              value={item.value}
              numOwned={purchasedItems}
              handleClick={() => {
                if (numCookies < item.cost) {
                  alert('Not enough 💰 for 🍪');
                  return;
                }

                setNumCookies(numCookies - item.cost);
                setPurchasedItems({
                  ...purchasedItems,
                  [item.id]: purchasedItems[item.id] + 1,
                })
              }}
            />
          )
        })}
      </ItemArea>
      <HomeLink link="/">Home</HomeLink>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  height: 100vh;
`;
const GameArea = styled.div`
  flex: 1;
  display: grid;
  place-items: center;
`;
const Button = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
`;

const Cookie = styled.img`
  width: 200px;
`;

const ItemArea = styled.div`
  height: 100%;
  padding-right: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const SectionTitle = styled.h3`
  text-align: center;
  font-size: 32px;
  color: yellow;
`;

const Indicator = styled.div`
  position: absolute;
  width: 250px;
  top: 0;
  left: 0;
  right: 0;
  margin: auto;
  text-align: center;
`;

const Total = styled.h3`
  font-size: 28px;
  color: lime;
`;

const HomeLink = styled(Link)`
  position: absolute;
  top: 15px;
  left: 15px;
  color:#666;
`;

export default Game;