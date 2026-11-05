import { useEffect, useRef } from 'react';

interface PhoneBook {
  id: string;
  title: string;
  cover: string;
  intro?: string;
  paragraphs: string[];
  tagline?: string;
  tone?: 'paper' | 'frost' | 'signal';
}

function PhoneBookEntry({ book }: { book: PhoneBook }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      el.dataset.visible = String(entry.isIntersecting);
    }, { threshold: 0.15 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return (
    <section ref={ref} data-section={book.id} className="writing-phone-book" data-visible="false">
      <div className="writing-phone-book__content">
        <header className="writing-phone-book__header">
          <img src={book.cover} alt={`${book.title} Book Cover`} width={400} height={600} loading={book.id === 'kaiju' ? 'eager' : 'lazy'} decoding="async" />
          <div>
            {book.intro && <p className="writing-phone-book__intro">{book.intro}</p>}
            <h2>{book.title}</h2>
          </div>
        </header>
        <div className="writing-phone-book__summary" data-tone={book.tone ?? 'frost'}>
          {book.paragraphs.map((text, i) => <p key={text} style={{ transitionDelay: `${i * 90}ms` }}>{text}</p>)}
          {book.tagline && <p className="writing-phone-book__tagline">{book.tagline}</p>}
        </div>
      </div>
    </section>
  );
}

export function WritingPhoneBooks({ covers }: { covers: Record<string, string> }) {
  const books: PhoneBook[] = [
    { id: 'kaiju', title: 'KAIJU', cover: covers.kaiju, intro: 'Book One of the Parable Trilogy', tone: 'frost', paragraphs: [
      "When an object crashes from the sky in Osaka, Japan, and a bizarre figure steps from the wreckage, psychiatrist Shigemitsu is enlisted by the military to draw on what he remembers of a man he hasn't thought of in twenty years.",
      'Kenji and a group of misfits realise that they each share a secret, and begin to suspect the town is not all it seems.',
      'For Hinata Togawa, a seemingly minor disappearance leads to a trail of unexplained vanishings and deepening corruption.'
    ], tagline: 'Part coming of age, part mystery, and part supernatural drama, this surreal adventure ties together the lives of three groups of people in a 1979 that only happened for those who were there.' },
    { id: 'hoax', title: 'HOAX', cover: covers.hoax, tone: 'paper', paragraphs: [
      'Peter Mayhew had hit rock bottom when he wrote Hoax, a mystical parody intended as his sign-off, a final insult to an industry he had grown to despise… and worst of all an overnight bestseller. He had finally made his name — and could never use it again.',
      "A year later, fleeing his reputation in an Australian motel, paralysed by writer's block, he receives a phone call from someone who claims to be part of a cult modelled on his book.",
      'Peter must convince a community it was all a hoax—but in doing so, he begins to question where his book truly came from.'
    ], tagline: 'A mind bending tale of literary fiction.' },
    { id: 'the-market', title: 'THE MARKET', cover: covers.market, tone: 'signal', paragraphs: [
      "James Tarreden's new life on Island—the world's first corporate nation-state—seems to be off without a hitch. Zero crime, colleagues who like him—even his love life is going disconcertingly well. In fact, everything is falling into place a little too easily…",
      "Under the wing of an enigmatic young CEO, James is inducted into the secrets behind his company's new technology, and with everything he knew about reality unravelling, finds himself in an increasingly high-stakes game of cat and mouse to discover the truth of Island."
    ], tagline: 'An existential psychological thriller.' },
    { id: 'oba', title: 'AMYA', cover: covers.amya, paragraphs: [
      'Set in Nairobi, Kenya. A linguist specialising in rare languages is seconded, reluctantly, to a village where there have been reports of an ancient undiscovered language still being spoken.',
      'While there, he comes across a mute girl who has not spoken since she was born. Silent and guarded around people, in the forest she comes alive, awakening something that has lain silent in him for longer than he can remember.',
      'In attempting to help the young girl communicate, he discovers that he may have more to learn from her than she does from him.'
    ] },
    { id: 'states-of-motion', title: 'STATES OF MOTION', cover: covers.states, intro: '“…the city was not the arrangement of many things but the shifting posture of one…”', paragraphs: [
      'A physicist on his way to a conference, with agents of unknown enemies closing in, carrying in his head a theory too fragile to document.',
      'A pianist haunted by a melody from childhood, a song he has been chasing his entire life.',
      'A man unable to distinguish truth from fiction, whose words are so dangerous they can alter reality itself.',
      'A secret cabal of plumbers employed in an age old scheme that has evolved in the wastes beneath the city.',
      'And through it all, one long summer, from which nothing ever seems to emerge...'
    ] },
    { id: 'how', title: 'HOW', cover: covers.how, intro: 'This is how.', tone: 'paper', paragraphs: [
      'With this realisation monk-shoemaker Shen Sho-Bi awakens from his trance of forty cycles, renounces the water-school of Luau and sets out on a journey to know the world.',
      'Part journal, part travelogue and part freeform reflection, here is the record of the wandering of the heretic Sho-Bi, which takes him from bandits and courtesans to kō matches with emperors, thought-contests with the great sages—and an audience with the gods themselves.',
      "Yet the greatest dialogue of all takes place between places, in Sho-Bi's conversations with the grass, leaves, rivers, and wind, with the world and the knowing of it."
    ] },
    { id: 'vice-versa', title: 'VICE VERSA', cover: covers.vice, intro: '“I am a man without imagination…”', paragraphs: [
      'Oswald T is a chaser, an investigator at one of the elite metacorporations that preside over Nexus, tasked with sniffing out undercover agents using black market technology to alter their personality.',
      'But when he is called in to a routine investigation of a rival company, something seems amiss…',
      'With a new—more deadly—form of biotech hitting the streets, Oz finds himself the hunted. To survive, he must solve the most bizarre case of his career: who killed Oswald T?'
    ], tagline: 'A strange noir where bioengineered worker species, aquatic telephones and sentient corporations are part of everyday life.' }
  ];
  return <>
    <div className="writing-phone-trilogy">
      <h1>The Parable Trilogy</h1>
      <p>A metaphysical saga unfolding across the shifting decades of an alternate 20th-century Japan, from mysterious towns and abandoned film sets to mountain temples and secret research facilities far from this world. With a cast as varied as its setting, childhood wonder collides with philosophy and fantasy in this compelling trilogy that explores the boundaries between truth and fiction.</p>
    </div>
    {books.map(book => <PhoneBookEntry key={book.id} book={book} />)}
  </>;
}