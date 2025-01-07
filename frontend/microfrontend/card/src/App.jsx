import React from "react";

import AddPlacePopup from "./components/AddPlacePopup";
import ImagePopup from "./components/ImagePopup";
import Card from "./components/Card";
import api from "./utils/api";

import "./index.css";

const App = ({currentUser}) => {
  const [selectedCard, setSelectedCard] = React.useState(null);
  const [cards, setCards] = React.useState([]);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);

  React.useEffect(() => {
    api
      .getCardList()
      .then((cardData) => {
        setCards(cardData);
      })
      .catch((err) => console.log(err));
  }, []);

  React.useEffect(() => {
    const handleAddPlaceClick = () => setIsAddPlacePopupOpen(true);

    window.addEventListener('add-place-click', handleAddPlaceClick);
    return () => {
      window.removeEventListener('add-place-click', handleAddPlaceClick);
    };
  }, []);

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((cards) => cards.map((c) => (c._id === card._id ? newCard : c)));
      })
      .catch((err) => console.log(err));
  }

  function handleCardDelete(card) {
    api
      .removeCard(card._id)
      .then(() => {
        setCards((cards) => cards.filter((c) => c._id !== card._id));
      })
      .catch((err) => console.log(err));
  }

  function handleAddPlaceSubmit(newCard) {
    api
      .addCard(newCard)
      .then((newCardFull) => {
        setCards([newCardFull, ...cards]);
        setIsAddPlacePopupOpen(false);
      })
      .catch((err) => console.log(err));
  }

  return (
    <>
      <section className="places page__section">
        <ul className="places__list">
          {cards.map((card) => (
            <Card
              key={card._id}
              currentUser={currentUser}
              card={card}
              onCardClick={(c) => setSelectedCard(c)}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDelete}
            />
          ))}
        </ul>
      </section>
      <AddPlacePopup
        isOpen={isAddPlacePopupOpen}
        onAddPlace={handleAddPlaceSubmit}
        onClose={() => setIsAddPlacePopupOpen(false)}
      />
      <ImagePopup card={selectedCard} onClose={() => setSelectedCard(null)}/>
    </>
  )
};

export default App;
