import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Character portraits
import kenjiPortrait from "@/assets/character-kenji-portrait.jpg";
import masakoPortrait from "@/assets/character-masako-portrait.jpg";
import kuboPortrait from "@/assets/character-kubo-portrait.jpg";
import hideoPortrait from "@/assets/character-hideo-portrait.jpg";
import nuboPortrait from "@/assets/character-nubo-portrait.jpg";
import emikoPortrait from "@/assets/character-emiko-portrait.jpg";
import hanaPortrait from "@/assets/character-hana-portrait.jpg";

// Character backgrounds
import kenjiBackground from "@/assets/kenji-house-background.jpg";
import masakoBackground from "@/assets/masako-icecream-background.jpg";
import kuboBackground from "@/assets/kubo-courtyard-background.jpg";

const characters = [
  {
    name: "Kenji",
    age: 12,
    description: "A shy small Japanese boy who just moved into town with his mum and his sister.",
    portrait: kenjiPortrait,
    background: kenjiBackground
  },
  {
    name: "Masako",
    age: 12,
    description: "A chubby curly haired Japanese boy who is always laughing. He lives in the local ice cream shop run by his mom and his sister.",
    portrait: masakoPortrait,
    background: masakoBackground
  },
  {
    name: "Kubo",
    age: 12,
    description: "A quiet bigger boy whose dad used to be in the military.",
    portrait: kuboPortrait,
    background: kuboBackground
  },
  {
    name: "Hideo",
    age: 12,
    description: "More distinctive looking, wearing a baseball cap with messy hair. He's got thick glasses held together by plaster in one corner and is holding a games console.",
    portrait: hideoPortrait,
    background: kenjiBackground
  },
  {
    name: "Nubo",
    age: 12,
    description: "A smaller boy with a big jumper on - oversized. He's an academic small Japanese boy, a bit mousy with longer curly hair.",
    portrait: nuboPortrait,
    background: masakoBackground
  },
  {
    name: "Emiko",
    age: 12,
    description: "A shy quiet 12-year-old girl.",
    portrait: emikoPortrait,
    background: kenjiBackground
  },
  {
    name: "Hana",
    age: 7,
    description: "Emiko's little sister. A tiny girl who is blind - she's got grey eyes and is holding a teddy bear.",
    portrait: hanaPortrait,
    background: masakoBackground
  }
];

export const CharacterSlideshow = () => {
  const [currentCharacter, setCurrentCharacter] = useState(0);

  const nextCharacter = () => {
    setCurrentCharacter((prev) => (prev + 1) % characters.length);
  };

  const prevCharacter = () => {
    setCurrentCharacter((prev) => (prev - 1 + characters.length) % characters.length);
  };

  const character = characters[currentCharacter];

  return (
    <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-lg">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${character.background})` }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 h-full flex items-center p-8">
        <div className="flex items-center space-x-8 w-full">
          {/* Character Portrait */}
          <div className="flex-shrink-0">
            <img 
              src={character.portrait} 
              alt={character.name}
              className="w-32 h-32 rounded-full object-cover border-4 border-white/80 shadow-lg"
            />
          </div>
          
          {/* Character Info */}
          <div className="flex-1 text-white">
            <h3 className="font-heading text-3xl font-bold mb-2">{character.name}</h3>
            <p className="text-lg opacity-90 mb-2">Age: {character.age}</p>
            <p className="font-body text-sm leading-relaxed opacity-80">
              {character.description}
            </p>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
        <Button
          variant="outline"
          size="lg"
          onClick={prevCharacter}
          className="bg-black/60 border-2 border-white/60 text-white hover:bg-black/80 hover:border-white hover:scale-110 transition-all duration-300 rounded-full w-12 h-12 p-0 backdrop-blur-sm shadow-xl"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
      </div>
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
        <Button
          variant="outline"
          size="lg"
          onClick={nextCharacter}
          className="bg-black/60 border-2 border-white/60 text-white hover:bg-black/80 hover:border-white hover:scale-110 transition-all duration-300 rounded-full w-12 h-12 p-0 backdrop-blur-sm shadow-xl"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>
      
      {/* Character Indicator */}
      <div className="absolute bottom-4 left-4 flex space-x-2">
        {characters.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full ${
              index === currentCharacter ? 'bg-white' : 'bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
};