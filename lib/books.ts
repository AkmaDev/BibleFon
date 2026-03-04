export type PageContent =
  | { type: "title"; image: string; title: string; titleFon: string }
  | { type: "meta"; reference: string; note: string; intro?: string }
  | { type: "text"; heading?: string; body: string; fonText?: string; image?: string }
  | { type: "image"; src: string; alt?: string }
  | { type: "mixed"; image: string; caption: string; body: string; fonText?: string }
  | { type: "quote"; verse: string; reference: string; fonText?: string }

export interface Book {
  id: string
  title: string
  titleFon: string
  description: string
  cover: string
  pages: PageContent[]
  readingTime: string
  ageRange: string
  accentColor: string
  testament: "ancien" | "nouveau"
}

export const books: Book[] = [
  {
    id: "david",
    title: "David le Petit Berger",
    titleFon: "Davidi Lɛngbɔ̌nyitɔ́ kpɛví ɔ",
    description:
      "L'histoire d'un jeune berger choisi par Dieu pour devenir roi d'Israël — et qui affronta un géant avec une simple fronde.",
    cover: "/coverDavid.png",
    readingTime: "15 min",
    ageRange: "6 – 12 ans",
    accentColor: "#c9922a",
    testament: "ancien",
    pages: [
      {
        type: "title",
        image: "/coverDavid.png",
        title: "David le Petit Berger",
        titleFon: "Davidi Lɛngbɔ̌nyitɔ́ kpɛví ɔ",
      },
      {
        type: "meta",
        reference: "1 Samuel 16 – 17",
        note: "Illustrations générées avec l'aide de l'intelligence artificielle.",
        intro: "Découvre comment David, un simple berger des collines de Bethléem, est choisi par Dieu pour devenir roi d'Israël — et comment, armé d'une seule fronde et de sa foi, il affronta le redoutable géant Goliath.",
      },
      {
        type: "mixed",
        image: "/samuel.png",
        caption: "Samuel, le prophète",
        body: "Il y a très longtemps, dans les collines de Bethléem, vivait un homme sage et fidèle nommé Samuel. Dieu lui parlait et il écoutait. Un jour, Dieu lui dit : « Va à Bethléem. J'ai choisi parmi les fils de Jessé celui qui sera roi d'Israël. »",
        fonText: "Égbé gegé mɛ, Bɛtlɛhɛmu fí gbɛ̃ nu mɛ, gbɛtɔ wanyiyi kpo gbɛtɔ fífá tɔn ɖé nɔ bo nyí Samuel.",
      },
      {
        type: "text",
        heading: "La Mission de Samuel",
        image: "/samuel.png",
        body: "Samuel obéit et se rendit à Bethléem, chez Jessé. Il vit les fils de Jessé défiler devant lui : des hommes grands, forts, impressionnants. Mais Dieu dit à Samuel : « Ne regarde pas leur apparence ni leur taille. Les hommes regardent le visage, mais moi, je regarde le cœur. »",
        fonText: "Samuel ɖɔ wɛ bo yi Bɛtlɛhɛmu Jessé xwé.",
      },
      {
        type: "mixed",
        image: "/david_harpe.png",
        caption: "David et sa harpe",
        body: "Le plus jeune des fils, David, gardait les brebis aux champs. Personne ne l'avait convié. Mais c'était lui — le petit berger qui chantait des psaumes sous les étoiles — que Dieu avait choisi.",
        fonText: "Davi nyí vǐ ɖokpo ɖò ye mɛ bǐ, é nɔ kpɔ́n agun lɛ gbɔn zǎn jí.",
      },
      {
        type: "text",
        heading: "L'Onction Sainte",
        image: "/samuel_david.png",
        body: "Samuel fit appeler David des champs. Quand il arriva, Dieu dit : « C'est lui ! Lève-toi et oint-le. » Samuel prit la corne d'huile et oignit David devant tous ses frères. Ce jour-là, l'Esprit de Dieu descendit sur David avec puissance.",
        fonText: "Samuel ɖɔ nú David ɖɔ é ni wa. Mawu ɖɔ : « É wɛ ! Yin bo tuùn i. »",
      },
      {
        type: "mixed",
        image: "/samuel_david.png",
        caption: "Samuel oint David",
        body: "Les frères de David regardaient, étonnés. Qui aurait cru que le plus petit, le plus jeune, celui que l'on avait laissé aux champs, était le choisi de Dieu ? Mais les voies de Dieu sont au-dessus des voies des hommes.",
        fonText: "Davi nɔví lɛ kpɔ́n bo mɔ nǔ kplɔkplɔ.",
      },
      {
        type: "mixed",
        image: "/david_saul.png",
        caption: "David à la cour du roi Saul",
        body: "Le roi Saul était tourmenté par un esprit sombre. Ses serviteurs lui dirent : « Il existe un jeune homme qui joue de la harpe à merveille. Sa musique apaise les esprits. » C'était David. Il fut conduit au palais et sa musique adoucit le cœur du roi.",
        fonText: "Saul ɖ'azǒ bo nɔ ɖ'acɛ nyɔna. É sín mɛsɛntɔ́ lɛ ɖɔ nú é ɖɔ Davi nɔ gbɛ kpa hlɔnhlɔn.",
      },
      {
        type: "text",
        heading: "La Menace Philistine",
        image: "/goliath.png",
        body: "Un jour, l'armée philistine se dressa contre Israël dans la vallée d'Élah. Et du camp ennemi surgit un géant de près de trois mètres de haut : Goliath. Sa voix tonnait comme un orage : « Choisissez un homme parmi vous ! S'il me bat, nous serons vos serviteurs ! »",
        fonText: "Azɔn ɖokpo, togun Filistin lɛ yì Izlayɛli jí.",
      },
      {
        type: "mixed",
        image: "/goliath.png",
        caption: "Goliath, le géant",
        body: "Goliath portait une armure de bronze de cinquante-sept kilos. Sa lance était comme un rouleau de tisserand. Il défia l'armée d'Israël quarante jours et quarante nuits. Aucun soldat n'osait lui répondre. La peur s'était emparée du camp.",
        fonText: "Goliyatu nɔ dó hlɔnhlɔn tɔn gbɔ bo nɔ ɖɔ : « Mi mɛ ɖěɛ wɛ na sɛ̀ mì ? »",
      },
      {
        type: "text",
        heading: "David au Camp",
        image: "/david.jpg",
        body: "David était venu apporter de la nourriture à ses frères soldats. Il entendit les paroles de Goliath et dit : « Qui est ce Philistin incirconcis pour défier les armées du Dieu vivant ? » Ses frères se moquèrent de lui. Mais David n'avait pas peur.",
        fonText: "Davi wá kplɔ́n nǔ xɔ nú é sín nɔví lɛ. É ɖótó Goliyatu gbe bo ɖɔ nǔ gbejinɔtɔ́.",
      },
      {
        type: "mixed",
        image: "/david_goliath.png",
        caption: "David face à Goliath",
        body: "Saul voulut armer David de son armure. Mais elle était trop grande. David la retira et dit : « Je n'ai pas l'habitude de ces choses. » Il prit son bâton, sa fronde, et choisit cinq pierres lisses dans le ruisseau. Puis il s'avança vers Goliath.",
        fonText: "Davi ɖó gankpa tɔn lɛ, bo sɔ́ flú ɖaxó atɔ́n na.",
      },
      {
        type: "text",
        heading: "La Victoire",
        image: "/david_goliath.png",
        body: "« Tu viens vers moi avec une épée et une lance », cria David, « mais moi je viens vers toi au nom du Seigneur ! » Il fit tournoyer sa fronde. La pierre fendit l'air. Elle frappa Goliath au front. Le géant s'effondra face contre terre. David avait vaincu par la foi.",
        fonText: "Davi ɖɔ : « Hwe nu mì bo wá gɔ́n mì ; mɔ̌ wiwa nɛ. Mawu Mavɔmavɔ sín nyikɔ mɛ wɛ un wá. »",
      },
      {
        type: "text",
        heading: "Le Roi Promis",
        image: "/coverDavid.png",
        body: "Ce jour-là, toute l'armée d'Israël poussa un grand cri de joie. David devint le héros du peuple. Et des années plus tard, fidèle à sa promesse, Dieu fit de David le plus grand roi qu'Israël ait connu — un homme selon son propre cœur.",
        fonText: "Azɔn enɛ, Izlayɛli sín togun bǐ wɛ xlɛ́ awǎjijɛ.",
      },
      {
        type: "quote",
        verse:
          "« La révélation de tes paroles éclaire, elle donne de l'intelligence aux simples. »",
        reference: "Psaume 119 : 130",
        fonText: "Hwɛdo e Mawu ɖɔ é nɔ hɛn wezun ɖ'ayǐ, bo nɔ sɔ́ mɛ gègě ayiɖoɖo.",
      },
    ],
  },
  {
    id: "moise",
    title: "Moïse et le Buisson Ardent",
    titleFon: "Mɔyizi kpo atín e ɖò zo jí é kpo",
    description:
      "Un berger ordinaire dans le désert reçoit un appel extraordinaire de Dieu — au cœur des flammes d'un buisson qui ne brûle pas.",
    cover: "/moses.jpg",
    readingTime: "10 min",
    ageRange: "5 – 12 ans",
    accentColor: "#e05a1b",
    testament: "ancien",
    pages: [
      {
        type: "title",
        image: "/moses.jpg",
        title: "Moïse et le Buisson Ardent",
        titleFon: "Mɔyizi kpo atín e ɖò zo jí é kpo",
      },
      {
        type: "meta",
        reference: "Exode 3 – 4",
        note: "Illustrations générées avec l'aide de l'intelligence artificielle.",
        intro: "Suis Moïse, un humble berger du désert de Madian, lorsque Dieu l'appelle depuis un buisson en flammes pour libérer tout un peuple. Une histoire de courage, d'obéissance et de la puissance du nom divin.",
      },
      {
        type: "text",
        heading: "Le Berger du Désert",
        image: "/moses.jpg",
        body: "Moïse vivait dans le désert de Madian depuis quarante ans. Loin de l'Égypte où il avait grandi, loin du palais du Pharaon, il menait ses brebis sur la montagne de Dieu, le mont Horeb. C'était un homme simple, marqué par les années.",
        fonText: "Moïzi nɔ gbɔn Madiyanu sín zɛ mɛ ɖò xwè nɛ̌tɔn mɔkpan.",
      },
      {
        type: "mixed",
        image: "/moses.jpg",
        caption: "Moïse dans le désert",
        body: "Un jour comme les autres, Moïse conduisit son troupeau au-delà du désert. Et soudain, il vit quelque chose d'étrange : un buisson en flammes. Mais les flammes ne consumaient pas le buisson. Il ne brûlait pas. « Comme c'est étrange ! » pensa Moïse. Il s'approcha.",
        fonText: "Azɔn ɖokpo, Moïzi kpɔ́ nǔ ɖé e sín wezun nɔ wá gɔ́ é, amɔ̌ é ka ma hɛn fǔ ǎ.",
      },
      {
        type: "text",
        heading: "La Voix dans le Feu",
        image: "/moses.jpg",
        body: "Quand Dieu vit que Moïse s'approchait pour regarder, il l'appela du milieu du buisson : « Moïse ! Moïse ! » Et Moïse répondit : « Me voici. » Dieu dit alors : « N'approche pas d'ici. Retire tes sandales de tes pieds, car le lieu où tu te tiens est une terre sainte. »",
        fonText: "Mawu ylɔ́ Moïzi sín zinkpodo sí mɛ : « Moïzi ! Moïzi ! » É wɛ é ɖɔ : « Nɛ, un ɖí. »",
      },
      {
        type: "text",
        heading: "Je Suis Qui Je Suis",
        image: "/moses.jpg",
        body: "Moïse cacha son visage car il avait peur de regarder Dieu. Dieu dit : « J'ai vu la souffrance de mon peuple en Égypte. J'ai entendu son cri. Je suis descendu pour le délivrer. Et maintenant, je t'envoie vers Pharaon. » Moïse demanda : « Qui suis-je, moi, pour aller vers Pharaon ? »",
        fonText: "Moïzi ɖin é sín ɖokpo ɖ'agɔ ɖó é nyí xɛsi kpɔ́ Mawu.",
      },
      {
        type: "text",
        heading: "La Promesse de Dieu",
        image: "/moses.jpg",
        body: "Dieu répondit : « Je serai avec toi. » Moïse dit encore : « Si on me demande ton nom, que dirai-je ? » Dieu répondit : « Je suis Celui qui suis. Dis aux fils d'Israël : Je Suis m'a envoyé vers vous. » C'était le nom saint de Dieu, révélé pour la première fois.",
        fonText: "Mawu yí gbè : « Un na nɔ towe. »",
      },
      {
        type: "text",
        heading: "Un Appel Ordinaire",
        image: "/moses.jpg",
        body: "Moïse n'était pas un roi. Il n'était pas un guerrier. Il bégayait quand il parlait. Pourtant, Dieu l'avait choisi — lui, le berger du désert — pour accomplir la plus grande délivrance de l'histoire. Parce que Dieu ne cherche pas les puissants. Il cherche les disponibles.",
        fonText: "Moïzi nyí ɖagbe guda, ɔ, é ka ma nyí axɔ́sú ǎ. Amɔ̌ Mawu sɔ́ é.",
      },
      {
        type: "quote",
        verse: "« Je serai avec toi. »",
        reference: "Exode 3 : 12",
        fonText: "Un na nɔ towe.",
      },
    ],
  },
  {
    id: "noe",
    title: "Noé et l'Arc-en-ciel",
    titleFon: "Noée kpo Atínsɛ́n ɔ",
    description:
      "Un homme juste, un déluge immense, et la plus belle promesse de Dieu tracée dans le ciel : une alliance pour toujours.",
    cover: "/noah.jpg",
    readingTime: "10 min",
    ageRange: "4 – 10 ans",
    accentColor: "#2a7fbf",
    testament: "ancien",
    pages: [
      {
        type: "title",
        image: "/noah.jpg",
        title: "Noé et l'Arc-en-ciel",
        titleFon: "Noée kpo Atínsɛ́n ɔ",
      },
      {
        type: "meta",
        reference: "Genèse 6 – 9",
        note: "Illustrations générées avec l'aide de l'intelligence artificielle.",
        intro: "Découvre comment Noé, un homme juste parmi tous, fait confiance à Dieu et construit une immense arche pour sauver sa famille et les animaux — et la magnifique promesse tracée dans le ciel après le déluge.",
      },
      {
        type: "text",
        heading: "Un Homme Différent",
        image: "/noah.jpg",
        body: "À l'époque de Noé, le monde était rempli de violence et de méchanceté. Les hommes avaient oublié Dieu. Mais parmi eux, il y avait un homme qui marchait avec Dieu chaque jour. Son nom était Noé. Il était juste, intègre, fidèle.",
        fonText: "Noée sín hwɛ mɛ, gbɛ̀ ɔ tíìn nǔ yɔyɔ̌ kpo wuvɛ̌ kpo.",
      },
      {
        type: "mixed",
        image: "/noah.jpg",
        caption: "Noé et l'arche",
        body: "Dieu dit à Noé : « Je vais envoyer un déluge sur la terre. Mais toi, construis une arche — un grand bateau — en bois de gaufre. Tu y entreras avec ta famille, et tu prendras avec toi un couple de chaque espèce d'animaux. » Noé obéit sans poser de questions.",
        fonText: "Mawu ɖɔ nú Noée : « Yi só batoo ɖé. » Noée ɖótó gbè enɛ.",
      },
      {
        type: "text",
        heading: "La Pluie Sans Fin",
        image: "/noah.jpg",
        body: "Quand Noé eut terminé l'arche, Dieu lui dit d'y entrer. Les écluses du ciel s'ouvrirent. La pluie tomba pendant quarante jours et quarante nuits. Les eaux montèrent. Elles couvrirent les collines, puis les montagnes. Mais l'arche flottait, portée en sûreté.",
        fonText: "Jɔhɔn wá bo lɛ̀ azǎn nɛ̌tɔn ɖokpo kpo zǎn ɖokpo kpo.",
      },
      {
        type: "text",
        heading: "La Colombe et le Rameau",
        image: "/noah.jpg",
        body: "Après de longs mois, les eaux commencèrent à baisser. Noé envoya une colombe. Elle revint avec un rameau d'olivier vert dans le bec. Noé sut alors que la terre séchait. Dieu dit : « Sors de l'arche. La terre est prête. » Et Noé sortit.",
        fonText: "Kɔ́ jɔ jɔ hwenu ɔ, Noée sɛ́ axɔ ɖé dó.",
      },
      {
        type: "text",
        heading: "La Promesse de l'Arc-en-ciel",
        image: "/noah.jpg",
        body: "Dieu parla à Noé et dit : « Je fais une alliance avec vous et avec toute créature vivante. Je placerai mon arc-en-ciel dans les nuages. Il sera le signe de mon alliance avec la terre. Je ne détruirai plus jamais la terre par les eaux d'un déluge. »",
        fonText: "Mawu ɖɔ : « Un na ɖó sɛxwɛ ɖokpo kpo mi kpo : un na tlɛ jɔhɔn gbɔ dó gbɛ̀ ǔ ǎ. »",
      },
      {
        type: "text",
        heading: "Un Signe dans le Ciel",
        image: "/noah.jpg",
        body: "Et là, dans le ciel après la pluie, apparut pour la première fois l'arc-en-ciel. Ses couleurs illuminèrent le ciel lavé. Noé leva les yeux et vit la promesse de Dieu tracée en lumière. Ce signe est là pour nous rappeler que Dieu tient toujours ses promesses.",
        fonText: "Atínsɛ́n ɔ xlɛ́ éɖée ɖò jikpá jí. Noée kpɔ́ Mawu sín nǔɖɔɖ'ayǐ.",
      },
      {
        type: "quote",
        verse:
          "« J'établis mon alliance avec vous : il ne sera plus jamais coupé de chair par les eaux du déluge. »",
        reference: "Genèse 9 : 11",
        fonText: "Un na ɖó sɛxwɛ ɖokpo kpo mi kpo.",
      },
    ],
  },
]

export function getBookById(id: string): Book | undefined {
  return books.find((b) => b.id === id)
}
