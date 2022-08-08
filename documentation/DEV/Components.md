Osnovne Custom komponente pravljene u tailwind koje se koriste svuda u aplikaciji.

https://www.smashingmagazine.com/2020/05/reusable-react-components-tailwind/

#Tailwind pristup
U odnosu na tradicionalni način pisanja stilova putem CSS-a, Tailwind nam daje takozvane "utiltiy" klase. Samim tim nemamo potrebu da sami pišemo CSS, smisljamo imena za klase itd. već primenjujemo gotove klase i time formiramo dizajn kakav mi želimo.

Sav spisak utility klasa, kako se one koriste i dorađuju imamo u dokumentaciji koja ima i propratne primere. 
[Tailwind Dokumentacija](https://tailwindcss.com/docs/installation)

Ono što je bitno da napomenemo, media query koji nam omogućuju primenu stilova u odnosu na veličinu ekrana i preko kojih postižemo "responsive" dizajn su "mobile first" u Tailwindu. To znači da se klase primenju od najmanje dimenzije ekrana ka najvećoj.

# Tailwind compiler
Tailwind dolazi sa svojim kompajlerom koji posmatra naše tsx fajlove kroz ceo projekat, i u odnosu na klase koje smo koristili, generiše stilove u CSS fajl i automatski odradi "minify".

Kada je potrebno stilizovati nešto, pokrenite `npm run build:css` i compiler je pokrenut u "watch" modu rada i kada sačuvate izmene u nekom tsx fajlu, on će osvežiti glavni CSS fajl.