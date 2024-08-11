import "./App.css";
import { useEffect, useState } from "react";
import { TarotCardType } from "./types/tarotCardType";
import { imageMap } from "./utils/imageMap";
import Card from "./components/card.tsx";
import Modal from "./components/modal.tsx";

function App() {
  const [tarotCards, setTarotCards] = useState<TarotCardType[]>([]);
  const [isFront, setIsFront] = useState(true);
  // const [currentCard, setCurrentCard] = useState(tarotCards[0]);
  const [readingType, setReadingType] = useState<"oneCard" | "threeCard">(
    "oneCard"
  );
  const [selectedCards, setSelectedCards] = useState<TarotCardType[]>([]);

  useEffect(() => {
    const fetchTarotCards = async () => {
      try {
        const response = await fetch("http://localhost:5070/api/TarotCard");
        if (!response.ok) throw new Error("sorry 200 OK was not returned");

        const tarotCardData = await response.json();
        setTarotCards(tarotCardData);
        setSelectedCards([tarotCardData[0]]);
      } catch (error) {
        console.error("fetch didnt work:", error);
      }
    };
    fetchTarotCards();
  }, []);
  // .then((response) => {
  //   if (!response.ok) {
  //     throw new Error();
  //   }
  //   return response.json();
  // })
  // .then((data) => {
  //   setTarotCards(data);
  //   setSelectedCards([data[0]]);
  // })
  // .catch((error) => {
  //   console.error("DEBUG the fetch didnt work here is the error:", error);
  // });

  const showModal = (id: string) => {
    const modal = document.getElementById(id) as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  };

  const handleClick = () => {
    // setIsFront(!isFront);
    // if (isFront) {
    //   const randomIndex = Math.floor(Math.random() * tarotCards.length);
    //   setCurrentCard(tarotCards[randomIndex]);
    //   showModal("my_modal_5");
    // }
    if (readingType === "oneCard") {
      const randomIndex = Math.floor(Math.random() * tarotCards.length);
      setSelectedCards([tarotCards[randomIndex]]);
    } else if (readingType === "threeCard") {
      const selected: TarotCardType[] = [];
      const cardIndexes = new Set<number>();

      while (cardIndexes.size < 3) {
        const randomIndex = Math.floor(Math.random() * tarotCards.length);
        if (!cardIndexes.has(randomIndex)) {
          cardIndexes.add(randomIndex);
          selected.push(tarotCards[randomIndex]);
        }
      }
      setSelectedCards(selected);
    }
    setIsFront(false);
    showModal("my_modal_5");
  };

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold underline">Tarot Reader</h1>
      </div>
      <div>
        <button
          className={`btn ${readingType === "oneCard" ? "btn-primary" : ""}`}
          onClick={() => setReadingType("oneCard")}
        >
          One card reading
        </button>

        <button
          className={`btn ${readingType === "threeCard" ? "btn-primary" : ""}`}
          onClick={() => setReadingType("threeCard")}
        >
          Three card reading
        </button>
      </div>
      <section className="">
        {selectedCards.length > 0 ? (
          selectedCards.map((card, index) => (
            <Card
              key={index}
              card={card}
              isFront={isFront}
              imageMap={imageMap}
              onClick={handleClick}
            />
          ))
        ) : (
          <p>oopsy cards found!</p>
        )}
        {selectedCards.length > 3 && <Modal card={selectedCards[0]} />}
        {/* <Modal card={selectedCards[0]} /> */}
      </section>
    </>
  );
}

export default App;
