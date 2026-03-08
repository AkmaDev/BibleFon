export type PageContent =
  | { type: "title"; image: string; title: string; titleFon: string }
  | { type: "meta"; reference: string; note: string; intro?: string }
  | { type: "text"; heading?: string; body: string; fonText?: string; image?: string; imgPosition?: string; audioFiles?: { src: string; fonText: string }[] }
  | { type: "image"; src: string; alt?: string }
  | { type: "mixed"; image: string; caption: string; body: string; fonText?: string; imgPosition?: string; audioFiles?: { src: string; fonText: string }[] }
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
  comingSoon?: boolean
}

export const books: Book[] = [
  {
    id: "david",
    title: "David le Petit Berger",
    titleFon: "Davidi Lɛngbɔ̌nyitɔ́ kpɛví ɔ",
    description:
      "Venez découvrir les caractéristiques du cœur de l'homme selon le cœur de DIEU — à travers l'histoire de David, le simple berger que Dieu a choisi.",
    cover: "/illustrations/david/cover.jpg",
    readingTime: "15 min",
    ageRange: "6 – 12 ans",
    accentColor: "#c9922a",
    testament: "ancien",
    pages: [
      {
        type: "title",
        image: "/illustrations/david/cover.jpg",
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
        image: "/illustrations/david/samuel-bethlehem.jpg",
        imgPosition: "top",
        caption: "Samuel, le prophète",
        body: "L'Éternel dit à Samuel : « Quand cesseras-tu de pleurer sur Saül? Je l'ai rejeté afin qu'il ne règne plus sur Israël. Je t'envoie chez Isaï, le Bethléhémite, car j'ai vu parmi ses fils celui que je désire pour roi. Remplis ta corne d'huile et pars! » Samuel fit ce que l'Éternel avait dit et se rendit à Bethléhem.",
        fonText: "Mawu Mavɔmavɔ ɖɔ nú Samuwɛ́li ɖɔ: Hwetɛ́nu a nǎ gɔn avǐ ya dó Sawúlu tamɛ dó? Un gbɛ́ xó tɔn wɛ hǔn; é sɔ́ ná ɖu axɔ́sú ɖo Izlayɛ́li gbeɖé ǎ. Hwɛ ɔ́, un ná sɛ́ we dó Jɛsée Bɛteleyɛ́munu ɔ́ gɔ́n, ɖó mɛ e un jló ná sɔ́ axɔ́sú ɔ́, un mɔ ɖo vǐ tɔn lɛ́ɛ mɛ. Hǔn, sɔ́ lanzo towe bó kɔn ami d'é mɛ ní gɔ́, bó jɛ ali. Samuwɛ́li bló nǔ e Mawu Mavɔmavɔ ɖɔ n'i ɔ́ bǐ, bó yi Bɛteleyɛ́mu.",
        audioFiles: [
          { src: "/audio/david/samuel-bethlehem/1.wav", fonText: "Mawu Mavɔmavɔ ɖɔ nú Samuwɛ́li ɖɔ: Hwetɛ́nu a nǎ gɔn avǐ ya dó Sawúlu tamɛ dó?" },
          { src: "/audio/david/samuel-bethlehem/2.wav", fonText: "Un gbɛ́ xó tɔn wɛ hǔn; é sɔ́ ná ɖu axɔ́sú ɖo Izlayɛ́li gbeɖé ǎ." },
          { src: "/audio/david/samuel-bethlehem/3.wav", fonText: "Hwɛ ɔ́, un ná sɛ́ we dó Jɛsée Bɛteleyɛ́munu ɔ́ gɔ́n, ɖó mɛ e un jló ná sɔ́ axɔ́sú ɔ́, un mɔ ɖo vǐ tɔn lɛ́ɛ mɛ. Hǔn, sɔ́ lanzo towe bó kɔn ami d'é mɛ ní gɔ́, bó jɛ ali." },
          { src: "/audio/david/samuel-bethlehem/4.wav", fonText: "Samuwɛ́li bló nǔ e Mawu Mavɔmavɔ ɖɔ n'i ɔ́ bǐ, bó yi Bɛteleyɛ́mu." },
        ],
      },
      {
        type: "mixed",
        image: "/illustrations/david/samuel-david-jesse.jpg",
        caption: "Samuel chez Jessé",
        body: "Samuel obéit à l'Éternel et se rendit à Bethléhem. Lorsqu'ils entrèrent, il se dit, en voyant Éliab : « Certainement, l'oint de l'Éternel est ici devant lui. » Et l'Éternel dit à Samuel : « Ne prends point garde à son apparence et à la hauteur de sa taille, car je l'ai rejeté. L'homme regarde à ce qui frappe les yeux, mais l'Éternel regarde au cœur. »",
        fonText: "Samuwɛ́li bló nǔ e Mawu Mavɔmavɔ ɖɔ n'i ɔ́ bǐ, bó yi Bɛteleyɛ́mu. Ée Jɛsée kpó vǐ tɔn lɛ́ɛ kpó wá bɔ Samuwɛ́li mɔ Eliavu lě ɔ́, é ɖɔ dó ayi mɛ ɖɔ: «Un ɖiɖɔ mɛ e Mawu Mavɔmavɔ sɔ́ é ɖíe.» Mawu Mavɔmavɔ ká ɖɔ nú Samuwɛ́li ɖɔ: «Ma nú ninɔmɛ tɔn blɛ́ we ó, ma ka nú ga tɔn blɛ́ we ó, ɖó é wɛ un sɔ́ ǎ. Nǔ e ɖo wěxo ɔ́ wɛ gbɛtɔ́ nɔ kpɔ́n, ayixa mɛ wɛ nyɛ Mawu Mavɔmavɔ ká nɔ́ kpɔ́n.»",
        audioFiles: [
          { src: "/audio/david/samuel-bethlehem/4.wav",   fonText: "Samuwɛ́li bló nǔ e Mawu Mavɔmavɔ ɖɔ n'i ɔ́ bǐ, bó yi Bɛteleyɛ́mu." },
          { src: "/audio/david/samuel-david-jesse/5.wav", fonText: "Ée Jɛsée kpó vǐ tɔn lɛ́ɛ kpó wá bɔ Samuwɛ́li mɔ Eliavu lě ɔ́, é ɖɔ dó ayi mɛ ɖɔ: «Un ɖiɖɔ mɛ e Mawu Mavɔmavɔ sɔ́ é ɖíe.»" },
          { src: "/audio/david/samuel-david-jesse/6.wav", fonText: "Mawu Mavɔmavɔ ká ɖɔ nú Samuwɛ́li ɖɔ: «Ma nú ninɔmɛ tɔn blɛ́ we ó, ma ka nú ga tɔn blɛ́ we ó, ɖó é wɛ un sɔ́ ǎ. Nǔ e ɖo wěxo ɔ́ wɛ gbɛtɔ́ nɔ kpɔ́n, ayixa mɛ wɛ nyɛ Mawu Mavɔmavɔ ká nɔ́ kpɔ́n.»" },
        ],
      },
      {
        type: "text",
        heading: "Le Plus Jeune des Fils",
        image: "/illustrations/david/fils-jesse.jpg",
        body: "Isaï fit passer ses sept fils devant Samuel ; et Samuel dit à Isaï : « L'Éternel n'a choisi aucun d'eux. » Puis Samuel dit à Isaï : « Sont-ce là tous tes fils ? » Et il répondit : « Il reste encore le plus jeune, mais il fait paître les brebis. » Alors Samuel dit à Isaï : « Envoie-le chercher, car nous ne nous placerons pas avant qu'il ne soit venu ici. »",
        fonText: "Jɛsée ylɔ́ vǐ tɔn ɖokpó ɖokpó tɛ́nwe wá, bɔ Samuwɛ́li ɖɔ: «Mawu Mavɔmavɔ sɔ́ mɛ ɖokpó ɖo yě mɛ ǎ.» Samuwɛ́li gbɔ bo kanbyɔ́ Jɛsée ɖɔ: «Vǐ towe lɛ́ɛ bǐ jɛ́n ná?» Bɔ Jɛsée yí gbe n'i ɖɔ: «É kpo mɛ kpɛví ɔ́; è nɔ ylɔ́ ɛ ɖɔ Davídi; amɔ̌, é kplá gbɔ̌ lɛ́ɛ yi amagbo mɛ.» Énɛ́ ɔ́, Samuwɛ́li ɖɔ n'i ɖɔ: «Dǒ wɛn sɛ́ dó e din tlóló. É má wá fí ǎ ɔ́, mɛɖé ná ɖu nǔ e è xwlé Mawu é ǎ.»",
        audioFiles: [
          { src: "/audio/david/fils-jesse/7.wav", fonText: "Jɛsée ylɔ́ vǐ tɔn ɖokpó ɖokpó tɛ́nwe wá, bɔ Samuwɛ́li ɖɔ: «Mawu Mavɔmavɔ sɔ́ mɛ ɖokpó ɖo yě mɛ ǎ.»" },
          { src: "/audio/david/fils-jesse/8.wav", fonText: "Samuwɛ́li gbɔ bo kanbyɔ́ Jɛsée ɖɔ: «Vǐ towe lɛ́ɛ bǐ jɛ́n ná?» Bɔ Jɛsée yí gbe n'i ɖɔ: «É kpo mɛ kpɛví ɔ́; è nɔ ylɔ́ ɛ ɖɔ Davídi; amɔ̌, é kplá gbɔ̌ lɛ́ɛ yi amagbo mɛ.» Énɛ́ ɔ́, Samuwɛ́li ɖɔ n'i ɖɔ: «Dǒ wɛn sɛ́ dó e din tlóló. É má wá fí ǎ ɔ́, mɛɖé ná ɖu nǔ e è xwlé Mawu é ǎ.»" },
        ],
      },
      {
        type: "mixed",
        image: "/illustrations/david/onction.jpg",
        caption: "L'Onction de David",
        body: "Isaï l'envoya chercher. Or il était blond, avec de beaux yeux et une belle figure. L'Éternel dit à Samuel : « Lève-toi, oins-le, car c'est lui ! » Samuel prit la corne d'huile, et l'oignit au milieu de ses frères. L'esprit de l'Éternel saisit David, à partir de ce jour et dans la suite.",
        fonText: "Jɛsée sɛ́ mɛ dó gbě tɔn mɛ nǔgbó. Nyaví vɔvɔ ɖagbe ɖagbe ɖé wɛ, bó ɖó nukún cɔɔn. Ée é wá ɔ́, Mawu Mavɔmavɔ ɖɔ nú Samuwɛ́li ɖɔ: «Sí te bo kɔn ami dó ta n'i bó sɔ́ ɛ axɔ́sú. É wɛ un sɔ́.» Samuwɛ́li sɔ́ ami ɔ́ bó kɔn dó ta n'i bó sɔ́ ɛ axɔ́sú ɖo nɔví tɔn lɛ́ɛ nukún mɛ. Kpowun ɔ́, yɛ Mawu Mavɔmavɔ tɔn wá Davídi jí gbe énɛ́ gbe, bó nɔ jǐ tɔn káká sɔ́yi.",
        audioFiles: [
          { src: "/audio/david/onction/9.wav",  fonText: "Jɛsée sɛ́ mɛ dó gbě tɔn mɛ nǔgbó. Nyaví vɔvɔ ɖagbe ɖagbe ɖé wɛ, bó ɖó nukún cɔɔn. Ée é wá ɔ́, Mawu Mavɔmavɔ ɖɔ nú Samuwɛ́li ɖɔ: «Sí te bo kɔn ami dó ta n'i bó sɔ́ ɛ axɔ́sú. É wɛ un sɔ́.»" },
          { src: "/audio/david/onction/10.wav", fonText: "Samuwɛ́li sɔ́ ami ɔ́ bó kɔn dó ta n'i bó sɔ́ ɛ axɔ́sú ɖo nɔví tɔn lɛ́ɛ nukún mɛ. Kpowun ɔ́, yɛ Mawu Mavɔmavɔ tɔn wá Davídi jí gbe énɛ́ gbe, bó nɔ jǐ tɔn káká sɔ́yi." },
        ],
      },
      {
        type: "text",
        heading: "Saül et l'Esprit Sombre",
        image: "/illustrations/david/saul-trouble.jpg",
        imgPosition: "top",
        body: "L'esprit de l'Éternel se retira de Saül, qui fut agité par un mauvais esprit venant de l'Éternel. Les serviteurs de Saül lui dirent : « Ils chercheront un homme qui sache jouer de la harpe ; et, quand le mauvais esprit de Dieu sera sur toi, il jouera de sa main, et tu seras soulagé. » L'un des serviteurs dit : « J'ai vu un fils d'Isaï, Bethléhémite, qui sait jouer ; c'est un homme fort et vaillant, un guerrier, parlant bien et d'une belle figure, et l'Éternel est avec lui. »",
        fonText: "Yɛ Mawu Mavɔmavɔ tɔn gosín Sawúlu jí, bɔ Mawu Mavɔmavɔ sɛ́ yɛ nyanya ɖé dó e, bɔ é jɛ tagba dó n'i jí. Mɛsɛntɔ́ Sawúlu tɔn lɛ́ɛ ɖɔ n'i ɖɔ: «Mǐ mɛsɛntɔ́ mɛtɔn lɛ́ɛ ɖo gbesisɔ mɛ; mǐ nǎ yi ba mɛ e nyɔ́ kanhún xo ɔ́ ɖokpó, bɔ nú yɛ nyanya e Mawu sɛ́ dó ɔ́ wá jǐ mɛtɔn ɔ́, é ná nɔ́ xo kanhún ɔ́ nú mɛ, bɔ mɛ ná nɔ́ mɔ agbɔ̌n.» Mɛsɛntɔ́ lɛ́ɛ ɖokpó ká yí xó, bó ɖɔ: «Un tunwun Jɛsée Bɛteleyɛ́munu ɔ́ sín vǐ ɖokpó, bɔ é nyɔ́ nǔ xo ganjí. Nyaví ahwanfuntɔ́ ɖé wɛ. É nyɔ́ xó ɖɔ ganjí. É nyɔ́ ɖɛkpɛ. Asúká ɖokpó wɛ. Mawu Mavɔmavɔ ɖo kpɔ́ xá ɛ.»",
        audioFiles: [
          { src: "/audio/david/saul-trouble/11.wav", fonText: "Yɛ Mawu Mavɔmavɔ tɔn gosín Sawúlu jí, bɔ Mawu Mavɔmavɔ sɛ́ yɛ nyanya ɖé dó e, bɔ é jɛ tagba dó n'i jí." },
          { src: "/audio/david/saul-trouble/12.wav", fonText: "Mɛsɛntɔ́ Sawúlu tɔn lɛ́ɛ ɖɔ n'i ɖɔ: «Mǐ mɛsɛntɔ́ mɛtɔn lɛ́ɛ ɖo gbesisɔ mɛ; mǐ nǎ yi ba mɛ e nyɔ́ kanhún xo ɔ́ ɖokpó, bɔ nú yɛ nyanya e Mawu sɛ́ dó ɔ́ wá jǐ mɛtɔn ɔ́, é ná nɔ́ xo kanhún ɔ́ nú mɛ, bɔ mɛ ná nɔ́ mɔ agbɔ̌n.»" },
          { src: "/audio/david/saul-trouble/13.wav", fonText: "Mɛsɛntɔ́ lɛ́ɛ ɖokpó ká yí xó, bó ɖɔ: «Un tunwun Jɛsée Bɛteleyɛ́munu ɔ́ sín vǐ ɖokpó, bɔ é nyɔ́ nǔ xo ganjí. Nyaví ahwanfuntɔ́ ɖé wɛ. É nyɔ́ xó ɖɔ ganjí. É nyɔ́ ɖɛkpɛ. Asúká ɖokpó wɛ. Mawu Mavɔmavɔ ɖo kpɔ́ xá ɛ.»" },
        ],
      },
      {
        type: "mixed",
        image: "/illustrations/david/david-harpe.jpg",
        caption: "David à la cour du roi",
        body: "Saül envoya des messagers à Isaï, pour lui dire : « Envoie-moi David, ton fils, qui est avec les brebis. » David arriva auprès de Saül, et se présenta devant lui ; il plut beaucoup à Saül, et il fut désigné pour porter ses armes. Lorsque l'esprit de Dieu était sur Saül, David prenait la harpe et jouait de sa main ; Saül respirait alors plus à l'aise et se trouvait soulagé, et le mauvais esprit se retirait de lui.",
        fonText: "Ée Sawúlu se mɔ̌ ɔ́, é sɛ́ wɛn dó Jɛsée bo ɖɔ: «Sɛ́ vǐ towe Davídi e nɔ kplá lɛ̌ngbɔ́ towe lɛ́ɛ yi amagbo mɛ é dó mì.» Davídi yi Sawúlu gɔ́n. Nǔ tɔn nyɔ́ Sawúlu nukún mɛ káká, bɔ é sɔ́ ɛ, bɔ é nɔ́ hɛn ahwanfunnú tɔn lɛ́ɛ n'i. Sín hwenɛ́nu ɔ́, yɛ nyanya e Mawu sɛ́ dó Sawúlu ɔ́ wá jǐ tɔn hweɖěbǔnu ɔ́, Davídi nɔ sɔ́ kanhún bó nɔ xo. Énɛ́ ɔ́, yɛ nyanya ɔ́ nɔ́ gosín jǐ tɔn, bɔ gbɔjɛ tɔn nɔ yi do, bɔ é nɔ́ mɔ agbɔ̌n kpɛɖé.",
        audioFiles: [
          { src: "/audio/david/david-harpe/14.wav", fonText: "Ée Sawúlu se mɔ̌ ɔ́, é sɛ́ wɛn dó Jɛsée bo ɖɔ: «Sɛ́ vǐ towe Davídi e nɔ kplá lɛ̌ngbɔ́ towe lɛ́ɛ yi amagbo mɛ é dó mì.»" },
          { src: "/audio/david/david-harpe/15.wav", fonText: "Davídi yi Sawúlu gɔ́n. Nǔ tɔn nyɔ́ Sawúlu nukún mɛ káká, bɔ é sɔ́ ɛ, bɔ é nɔ́ hɛn ahwanfunnú tɔn lɛ́ɛ n'i." },
          { src: "/audio/david/david-harpe/16.wav", fonText: "Sín hwenɛ́nu ɔ́, yɛ nyanya e Mawu sɛ́ dó Sawúlu ɔ́ wá jǐ tɔn hweɖěbǔnu ɔ́, Davídi nɔ sɔ́ kanhún bó nɔ xo. Énɛ́ ɔ́, yɛ nyanya ɔ́ nɔ́ gosín jǐ tɔn, bɔ gbɔjɛ tɔn nɔ yi do, bɔ é nɔ́ mɔ agbɔ̌n kpɛɖé." },
        ],
      },
      {
        type: "text",
        heading: "La Menace Philistine",
        image: "/illustrations/david/camp.jpg",
        body: "Les Philistins réunirent leurs armées pour faire la guerre à Israël. Saül et les hommes d'Israël se rassemblèrent aussi. Les trois fils aînés d'Isaï avaient suivi Saül à la guerre. David était le plus jeune. Isaï dit à David, son fils : « Prends pour tes frères cet épha de grain rôti et ces dix pains, et cours au camp vers tes frères. Tu verras si tes frères se portent bien, et tu m'en donneras des nouvelles sûres. »",
        fonText: "Filisitɛ́ɛn lɛ́ɛ kplé ahwangɔnu yětɔn lɛ́ɛ ɖo Judáa yíkúngban jí, bó ná yi fun ahwan xá Izlayɛ́li ví lɛ́ɛ. Sawúlu kpó ahwangɔnu Izlayɛ́li tɔn lɔ kpó kplé. Jɛsée sín vǐ súnnu mɛxó atɔn lɛ́ɛ bǐ ka ɖo ahwangbénu xá Sawúlu. Davídi wɛ nyí yɔkpɔ́vú ɖo yě mɛ. Jɛsée ɖɔ nú vǐ tɔn Davídi gbe ɖokpó ɖɔ: «Sɔ́ nǔkún mimɛ ati ɖokpó élɔ́, kpó wɔ̌xúxú wǒ élɔ́ lɛ́ɛ kpó, bó kán wezun bó sɔ́ yi jó nú fofó towe lɛ́ɛ ɖo ahwankpá Izlayɛ́li ví lɛ́ɛ tɔn mɛ.»",
        audioFiles: [
          { src: "/audio/david/camp/17.wav", fonText: "Filisitɛ́ɛn lɛ́ɛ kplé ahwangɔnu yětɔn lɛ́ɛ ɖo Judáa yíkúngban jí, bó ná yi fun ahwan xá Izlayɛ́li ví lɛ́ɛ. Sawúlu kpó ahwangɔnu Izlayɛ́li tɔn lɔ kpó kplé." },
          { src: "/audio/david/camp/18.wav", fonText: "Jɛsée sín vǐ súnnu mɛxó atɔn lɛ́ɛ bǐ ka ɖo ahwangbénu xá Sawúlu. Davídi wɛ nyí yɔkpɔ́vú ɖo yě mɛ. Jɛsée ɖɔ nú vǐ tɔn Davídi gbe ɖokpó ɖɔ: «Sɔ́ nǔkún mimɛ ati ɖokpó élɔ́, kpó wɔ̌xúxú wǒ élɔ́ lɛ́ɛ kpó, bó kán wezun bó sɔ́ yi jó nú fofó towe lɛ́ɛ ɖo ahwankpá Izlayɛ́li ví lɛ́ɛ tɔn mɛ.»" },
        ],
      },
      {
        type: "mixed",
        image: "/illustrations/david/david-camp.jpg",
        imgPosition: "top",
        caption: "David arrive au camp",
        body: "David se leva de bon matin. Aussitôt arrivé, il demanda à ses frères comment ils se portaient.",
        fonText: "Davídi fɔ́n zǎn bó ɖidó. É yi fofó tɔn lɛ́ɛ gɔ́n, bó kanbyɔ́ ɖɔ nɛ̌ yě ɖe gbɔn a jí.",
        audioFiles: [
          { src: "/audio/david/david-camp/19.wav", fonText: "Davídi fɔ́n zǎn bó ɖidó. É yi fofó tɔn lɛ́ɛ gɔ́n, bó kanbyɔ́ ɖɔ nɛ̌ yě ɖe gbɔn a jí." },
        ],
      },
      {
        type: "mixed",
        image: "/illustrations/david/goliath.jpg",
        imgPosition: "top",
        caption: "Goliath, le géant",
        body: "Un homme sortit alors du camp des Philistins et s'avança entre les deux armées. Il se nommait Goliath, il était de Gath, et il avait une taille de six coudées et un empan. Le Philistin dit : « Je jette en ce jour un défi à l'armée d'Israël ! Donnez-moi un homme, et nous nous battrons ensemble. S'il peut me battre et qu'il me tue, nous vous serons assujettis ; mais si je l'emporte sur lui et que je le tue, vous nous serez assujettis et vous nous servirez. »",
        fonText: "Ahwanfuntɔ́ Filisitɛ́ɛn lɛ́ɛ tɔn ɖokpó tɔ́n sín ahwankpá yětɔn mɛ, bó wá gblɔ́n adǎn nú Izlayɛ́li ví lɛ́ɛ. Nya ɔ́ nɔ nyí Goliyati; Gati toxomɛnu wɛ. Ga tɔn yi mɛ̌tlukpo atɔn jɛjí. Nya Filisitɛ́ɛn ɔ́ lɛ́ ɖɔ: «Mi nyi gbehwán sɛ́ dó wɛ un ɖe égbé. Mi ɖe mɛ ɖokpó sɛ́ dó mì, nú nyi kpó é kpó ná kpé hun.» Ényí mɛ ɔ́ kpé wú bó ɖu ɖo jǐ ce bó hu mì ɔ́, mǐdɛɛ lɛ́ɛ ná húzú kannumɔ mitɔn, bó ná nɔ wa azɔ̌ nú mi. Lo ɔ́, ényí nyɛ wɛ kpé wú bó ɖu ɖo jǐ tɔn, bó hu i ɔ́, midɛɛ lɛ́ɛ ná nyí kannumɔ mǐtɔn, bó ná nɔ́ wa azɔ̌ nú mǐ.",
        audioFiles: [
          { src: "/audio/david/goliath/20.wav", fonText: "Ahwanfuntɔ́ Filisitɛ́ɛn lɛ́ɛ tɔn ɖokpó tɔ́n sín ahwankpá yětɔn mɛ, bó wá gblɔ́n adǎn nú Izlayɛ́li ví lɛ́ɛ. Nya ɔ́ nɔ nyí Goliyati; Gati toxomɛnu wɛ. Ga tɔn yi mɛ̌tlukpo atɔn jɛjí." },
          { src: "/audio/david/goliath/21.wav", fonText: "Nya Filisitɛ́ɛn ɔ́ lɛ́ ɖɔ: «Mi nyi gbehwán sɛ́ dó wɛ un ɖe égbé. Mi ɖe mɛ ɖokpó sɛ́ dó mì, nú nyi kpó é kpó ná kpé hun.»" },
          { src: "/audio/david/goliath/22.wav", fonText: "Ényí mɛ ɔ́ kpé wú bó ɖu ɖo jǐ ce bó hu mì ɔ́, mǐdɛɛ lɛ́ɛ ná húzú kannumɔ mitɔn, bó ná nɔ wa azɔ̌ nú mi. Lo ɔ́, ényí nyɛ wɛ kpé wú bó ɖu ɖo jǐ tɔn, bó hu i ɔ́, midɛɛ lɛ́ɛ ná nyí kannumɔ mǐtɔn, bó ná nɔ́ wa azɔ̌ nú mǐ." },
        ],
      },
      {
        type: "text",
        heading: "David devant le Roi",
        image: "/illustrations/david/david-saul.jpg",
        body: "Saül et tout Israël entendirent ces paroles du Philistin, et ils furent effrayés et saisis d'une grande crainte. David dit à Saül : « Que personne ne se décourage à cause de ce Philistin ! Ton serviteur ira se battre avec lui. » Saül dit à David : « Tu ne peux pas aller te battre avec ce Philistin, car tu es un enfant, et il est un homme de guerre dès sa jeunesse. »",
        fonText: "Sawúlu kpó Izlayɛ́li ví lɛ́ɛ bǐ kpó se xó e ɖɔ wɛ nya Filisitɛ́ɛn énɛ́ ɔ́ ɖe é. Ée yě se xó énɛ́ lɛ́ɛ ɔ́, ado hu yě bǐ, bɔ xɛsi ɖi yě ɖésú. Davídi yi ɖɔ nú Sawúlu ɖɔ: «Mɛ ɖokpó ma ɖi xɛsi nú nya Filisitɛ́ɛn énɛ́ ɔ́ ó. Nyɛ mɛsɛntɔ́ towe ná yi kpé hun xá ɛ.» Sawúlu ka ɖɔ nú Davídi ɖɔ: «A sixú kpé hun xá Filisitɛ́ɛn énɛ́ ɔ́ ǎ, ɖó yɔkpɔ́vú wɛ nú we, éyɛ́ ká kó ɖo ahwan mɛ sín vǔ.»",
        audioFiles: [
          { src: "/audio/david/david-saul/23.wav", fonText: "Sawúlu kpó Izlayɛ́li ví lɛ́ɛ bǐ kpó se xó e ɖɔ wɛ nya Filisitɛ́ɛn énɛ́ ɔ́ ɖe é. Ée yě se xó énɛ́ lɛ́ɛ ɔ́, ado hu yě bǐ, bɔ xɛsi ɖi yě ɖésú. Davídi yi ɖɔ nú Sawúlu ɖɔ: «Mɛ ɖokpó ma ɖi xɛsi nú nya Filisitɛ́ɛn énɛ́ ɔ́ ó. Nyɛ mɛsɛntɔ́ towe ná yi kpé hun xá ɛ.»" },
          { src: "/audio/david/david-saul/24.wav", fonText: "Sawúlu ka ɖɔ nú Davídi ɖɔ: «A sixú kpé hun xá Filisitɛ́ɛn énɛ́ ɔ́ ǎ, ɖó yɔkpɔ́vú wɛ nú we, éyɛ́ ká kó ɖo ahwan mɛ sín vǔ.»" },
        ],
      },
      {
        type: "mixed",
        image: "/illustrations/david/david-lion.jpg",
        imgPosition: "top",
        caption: "David et le lion",
        body: "David dit à Saül : « Ton serviteur faisait paître les brebis de son père. Quand un lion ou un ours venait en enlever une du troupeau, je courais après lui, je le frappais, et j'arrachais la brebis de sa gueule. S'il se dressait contre moi, je le saisissais par la gorge, je le frappais, et je le tuais. C'est ainsi que ton serviteur a terrassé le lion et l'ours, et il en sera du Philistin, de cet incirconcis, comme de l'un d'eux, car il a insulté l'armée du Dieu vivant. »",
        fonText: "Ée Sawúlu ɖɔ mɔ̌ ɔ́, Davídi ɖɔ n'i ɖɔ: «Mɛsɛntɔ́ towe wɛ nɔ kplá tɔ́ ce sín kanlin lɛ́ɛ yi amagbo mɛ, bɔ nú kinnikínní abǐ lɔnmɔ ɖé wá wlí kanlin lɛ́ɛ ɖokpó ɔ́, un nɔ bɛ́ wezun ɖo gǔdo tɔn, bó nɔ xo e, bó nɔ yí kanlin ɔ́ sín nu tɔn. Ényí é lílɛ́ kpan nukɔn mì ɔ́, un nɔ hɛn vɛ̌go tɔn, bó nɔ xo káká bɔ é nɔ kú. Lě e nyɛ mɛsɛntɔ́ towe hu kinnikínní mɔ̌kpán, bó hu lɔnmɔ mɔ̌kpán gbɔn é nɛ́. Nǔ e un nɔ dó sin xá lan énɛ́ lɛ́ɛ ɔ́ wɛ un ná dó sin xá Filisitɛ́ɛn énɛ́ lɔ.»",
        audioFiles: [
          { src: "/audio/david/david-lion/25.wav", fonText: "Ée Sawúlu ɖɔ mɔ̌ ɔ́, Davídi ɖɔ n'i ɖɔ: «Mɛsɛntɔ́ towe wɛ nɔ kplá tɔ́ ce sín kanlin lɛ́ɛ yi amagbo mɛ, bɔ nú kinnikínní abǐ lɔnmɔ ɖé wá wlí kanlin lɛ́ɛ ɖokpó ɔ́,»" },
          { src: "/audio/david/david-lion/26.wav", fonText: "un nɔ bɛ́ wezun ɖo gǔdo tɔn, bó nɔ xo e, bó nɔ yí kanlin ɔ́ sín nu tɔn. Ényí é lílɛ́ kpan nukɔn mì ɔ́, un nɔ hɛn vɛ̌go tɔn, bó nɔ xo káká bɔ é nɔ kú." },
          { src: "/audio/david/david-lion/27.wav", fonText: "Lě e nyɛ mɛsɛntɔ́ towe hu kinnikínní mɔ̌kpán, bó hu lɔnmɔ mɔ̌kpán gbɔn é nɛ́. Nǔ e un nɔ dó sin xá lan énɛ́ lɛ́ɛ ɔ́ wɛ un ná dó sin xá Filisitɛ́ɛn énɛ́ lɔ. Ðó mɛ énɛ́ e ma nɔ sɛn Mawu ǎ ɔ́ gblɔ́n adǎn nú ahwangɔnu Mawu gbɛɖe ɔ́ tɔn." },
        ],
      },
      {
        type: "mixed",
        image: "/illustrations/david/david-argumente.jpg",
        imgPosition: "top",
        caption: "La foi de David",
        body: "David dit encore : « L'Éternel, qui m'a délivré de la griffe du lion et de la patte de l'ours, me délivrera aussi de la main de ce Philistin. » Et Saül dit à David : « Va, et que l'Éternel soit avec toi ! »",
        fonText: "Davídi lɛ́ ɖɔ: «Mawu e nɔ hwlɛ́n mì sín kinnikínní fɛn mɛ, bó nɔ hwlɛ́n mì sín lɔnmɔ fɛn mɛ ɔ́ ná hwlɛ́n mì ɖo Filisitɛ́ɛn énɛ́ sí.» Bɔ Sawúlu ɖɔ nú Davídi ɖɔ: «Bo yi! Mawu Mavɔmavɔ ní nɔ kpɔ́ xá we.»",
        audioFiles: [
          { src: "/audio/david/david-argumente/28.wav", fonText: "Davídi lɛ́ ɖɔ: «Mawu e nɔ hwlɛ́n mì sín kinnikínní fɛn mɛ, bó nɔ hwlɛ́n mì sín lɔnmɔ fɛn mɛ ɔ́ ná hwlɛ́n mì ɖo Filisitɛ́ɛn énɛ́ sí.»" },
          { src: "/audio/david/david-argumente/29.wav", fonText: "Bɔ Sawúlu ɖɔ nú Davídi ɖɔ: «Bo yi! Mawu Mavɔmavɔ ní nɔ kpɔ́ xá we.»" },
        ],
      },
      {
        type: "mixed",
        image: "/illustrations/david/david-pierres.jpg",
        caption: "Les cinq pierres",
        body: "Il prit en main son bâton, choisit dans le torrent cinq pierres polies, et les mit dans sa gibecière de berger et dans sa poche.",
        fonText: "É sɔ́ kpo tɔn, bo yi cyán kɛ́n e wǔtu tɔn ɖíɖí ganjí ɔ́ atɔ́ɔ́n ɖo tɔ tó, bó bɛ́ dó lɛ̌ngbɔ́nyitɔ́ gló tɔn mɛ.",
        audioFiles: [
          { src: "/audio/david/david-pierres/30.wav", fonText: "É sɔ́ kpo tɔn, bo yi cyán kɛ́n e wǔtu tɔn ɖíɖí ganjí ɔ́ atɔ́ɔ́n ɖo tɔ tó, bó bɛ́ dó lɛ̌ngbɔ́nyitɔ́ gló tɔn mɛ." },
        ],
      },
      {
        type: "text",
        body: "À suivre...",
      },
      {
        type: "quote",
        verse:
          "« Tu viens vers moi avec une épée, une lance et un javelot ; mais moi, je viens vers toi au nom du Seigneur des armées. »",
        reference: "1 Samuel 17 : 45",
        fonText: "« Hwe nu mì bo wá gɔ́n mì ; mɔ̌ wiwa nɛ. Mawu Mavɔmavɔ sín nyikɔ mɛ wɛ un wá. »",
      },
    ],
  },
  {
    id: "fournaise",
    title: "Le 4ème Homme de la Fournaise",
    titleFon: "Gbɛtɔ́ Énɛ́ɛ́n ɔ ɖo Zowégbo mɛ",
    description:
      "Si tu marches dans le feu, je serai avec toi...",
    cover: "/fournaise.jpg",
    readingTime: "10 min",
    ageRange: "6 – 12 ans",
    accentColor: "#e05a1b",
    testament: "ancien",
    comingSoon: true,
    pages: [],
  },
  {
    id: "noe",
    title: "Noé",
    titleFon: "Noée",
    description:
      "Noé a entendu une voix que les gens de son temps n'entendaient pas...",
    cover: "/noe-cover.jpg",
    readingTime: "10 min",
    ageRange: "4 – 10 ans",
    accentColor: "#2a7fbf",
    testament: "ancien",
    comingSoon: true,
    pages: [],
  },
]

export function getBookById(id: string): Book | undefined {
  return books.find((b) => b.id === id)
}
