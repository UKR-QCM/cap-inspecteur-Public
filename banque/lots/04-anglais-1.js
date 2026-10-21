/*
 * Cap Inspecteur — lot 04-anglais-1
 * 33 questions d'anglais niveau B1 : V.1 choix de la bonne traduction (11),
 * V.2 prépositions (11), V.3 synonymes et antonymes (11).
 * Phrases originales. Rédaction et vérification des sources : 21 octobre 2026.
 */
CI.banque.ajouter([

  /* ===================== V.1 — Choix de la bonne traduction ===================== */

  {
    id: "Q-V.1-02", bloc: "V", notion: "V.1", difficulte: 2, angle: "distinction",
    enonce: "Choisissez la traduction correcte : « L'entreprise a réalisé un bénéfice important. »",
    choix: [
      "The company made a large profit.",
      "The company made a large benefit.",
      "The company did a large profit.",
      "The company made a large profite."
    ],
    bonne: 0, ordreFixe: false,
    explication: "Le bénéfice d'une entreprise se dit « profit », et l'on dit « make a profit » (faire, réaliser un bénéfice). « Benefit » est un faux ami : il désigne un avantage, un effet utile, ou une allocation versée par l'État, jamais le bénéfice comptable d'une entreprise. « Do a profit » n'est pas une construction anglaise : le verbe attendu est « make ». « Profite » est une faute d'orthographe : le mot anglais s'écrit « profit », sans « e » final.",
    aRetenir: "Bénéfice d'une entreprise = profit (make a profit) ; benefit = avantage ou allocation.",
    references: [
      { texte: "Oxford Learner's Dictionaries, entrée « profit » (nom)", article: "" },
      { texte: "Oxford Learner's Dictionaries, entrée « benefit » (nom)", article: "" }
    ],
    source: "https://www.oxfordlearnersdictionaries.com/definition/english/profit_1",
    piege: "Traduire « bénéfice » par « benefit ».",
    voirAussi: ["V.5"],
    nature: "stable", verifieLe: "2026-10-21", statut: "valide", raisonAVerifier: "", version: 1
  },

  {
    id: "Q-V.1-03", bloc: "V", notion: "V.1", difficulte: 1, angle: "definition",
    enonce: "Choisissez la traduction correcte : « Le rendez-vous est confirmé pour demain. »",
    choix: [
      "The appointment is confirmed for tomorrow.",
      "The appointement is confirmed for tomorrow.",
      "The appointment is confirmed for tomorow.",
      "The appointment is confirm for tomorrow."
    ],
    bonne: 0, ordreFixe: false,
    explication: "Un rendez-vous fixé à l'avance, par exemple avec un service ou un médecin, se dit « appointment ». Le mot s'écrit sans « e » entre « appoint » et « ment », contrairement au français « appointement ». « Tomorrow » prend deux « r ». Enfin, au passif, le verbe se met au participe passé : « is confirmed », et non « is confirm ».",
    aRetenir: "appointment (sans e au milieu) ; tomorrow (un m, deux r) ; passif = be + participe passé.",
    references: [{ texte: "Oxford Learner's Dictionaries, entrée « appointment »", article: "" }],
    source: "https://www.oxfordlearnersdictionaries.com/definition/english/appointment",
    piege: "Ajouter un « e » sous l'influence du français et oublier le second « r » de « tomorrow ».",
    voirAussi: [],
    nature: "stable", verifieLe: "2026-10-21", statut: "valide", raisonAVerifier: "", version: 1
  },

  {
    id: "Q-V.1-04", bloc: "V", notion: "V.1", difficulte: 1, angle: "definition",
    enonce: "Choisissez la traduction correcte : « Merci d'indiquer votre adresse et votre numéro de téléphone. »",
    choix: [
      "Please give your address and your phone number.",
      "Please give your adress and your phone number.",
      "Please give your adresse and your phone number.",
      "Please give your address and your phone numero."
    ],
    bonne: 0, ordreFixe: false,
    explication: "En anglais, « adresse » s'écrit « address », avec deux « d » et deux « s ». « Adress » oublie le second « d », et « adresse » reprend l'orthographe française. « Numéro » se traduit par « number » : « numero » n'est pas un mot anglais.",
    aRetenir: "address : deux d, deux s, pas de e final.",
    references: [{ texte: "Oxford Learner's Dictionaries, entrée « address » (nom)", article: "" }],
    source: "https://www.oxfordlearnersdictionaries.com/definition/english/address_1",
    piege: "Écrire « adress » ou « adresse » sur le modèle du français.",
    voirAussi: [],
    nature: "stable", verifieLe: "2026-10-21", statut: "valide", raisonAVerifier: "", version: 1
  },

  {
    id: "Q-V.1-05", bloc: "V", notion: "V.1", difficulte: 1, angle: "definition",
    enonce: "Choisissez la traduction correcte : « Le gouvernement doit mieux protéger l'environnement. »",
    choix: [
      "The government must protect the environment better.",
      "The government must protect the environnement better.",
      "The government must protect the enviroment better.",
      "The government must protect the environement better."
    ],
    bonne: 0, ordreFixe: false,
    explication: "Le mot anglais s'écrit « environment » : un seul « n » avant « ment », et un « n » après « iro ». « Environnement » est l'orthographe française, avec deux « n ». « Enviroment » oublie le « n » de « environ ». « Environement » ajoute un « e » qui n'existe pas en anglais.",
    aRetenir: "environment = environ + ment, un seul n au milieu.",
    references: [{ texte: "Oxford Learner's Dictionaries, entrée « environment »", article: "" }],
    source: "https://www.oxfordlearnersdictionaries.com/definition/english/environment",
    piege: "Doubler le « n » comme en français.",
    voirAussi: [],
    nature: "stable", verifieLe: "2026-10-21", statut: "valide", raisonAVerifier: "", version: 1
  },

  {
    id: "Q-V.1-06", bloc: "V", notion: "V.1", difficulte: 2, angle: "distinction",
    enonce: "Choisissez la traduction correcte : « Le contribuable doit remplir sa déclaration de revenus avant la date limite. »",
    choix: [
      "The taxpayer must fill in their tax return before the deadline.",
      "The taxpayer must fulfil their tax return before the deadline.",
      "The contributor must fill in their tax return before the deadline.",
      "The taxpayer must fill in their tax return before the limit date."
    ],
    bonne: 0, ordreFixe: false,
    explication: "Le contribuable est le « taxpayer », la personne qui paie l'impôt ; la déclaration de revenus est la « tax return » ; remplir un formulaire se dit « fill in » ; la date limite est la « deadline ». « Fulfil » signifie accomplir ou remplir une obligation, une promesse, un rôle, pas compléter un formulaire. « Contributor » désigne une personne qui contribue (à un projet, à une publication), pas le redevable de l'impôt. « Limit date » est un calque du français qui ne s'emploie pas.",
    aRetenir: "taxpayer (contribuable), tax return (déclaration), fill in (remplir un formulaire), deadline (date limite).",
    references: [
      { texte: "Oxford Learner's Dictionaries, entrées « tax return », « fill in », « fulfil », « taxpayer », « deadline »", article: "" }
    ],
    source: "https://www.oxfordlearnersdictionaries.com/definition/english/tax-return",
    piege: "Traduire « remplir » par « fulfil » et « contribuable » par « contributor ».",
    voirAussi: ["V.5"],
    nature: "stable", verifieLe: "2026-10-21", statut: "valide", raisonAVerifier: "", version: 1
  },

  {
    id: "Q-V.1-07", bloc: "V", notion: "V.1", difficulte: 2, angle: "distinction",
    enonce: "Choisissez la traduction correcte : « The minister resigned yesterday. »",
    choix: [
      "Le ministre a démissionné hier.",
      "Le ministre s'est résigné hier.",
      "Le ministre a signé de nouveau hier.",
      "Le ministre a été désigné hier."
    ],
    bonne: 0, ordreFixe: false,
    explication: "« To resign » signifie annoncer officiellement que l'on quitte son poste ou sa fonction, c'est-à-dire démissionner (« resign as minister », « resign from the board »). C'est un faux ami : « se résigner » se dit « resign yourself to something », construction pronominale absente de la phrase. La ressemblance avec « re- » + « sign » fait croire à tort au sens « signer de nouveau ». « Être désigné » se traduit par « be appointed », qui n'a rien à voir avec « resign ».",
    aRetenir: "resign = démissionner ; resignation = démission.",
    references: [{ texte: "Oxford Learner's Dictionaries, entrée « resign »", article: "" }],
    source: "https://www.oxfordlearnersdictionaries.com/definition/english/resign",
    piege: "Se laisser tromper par la ressemblance avec « se résigner ».",
    voirAussi: ["V.5"],
    nature: "stable", verifieLe: "2026-10-21", statut: "valide", raisonAVerifier: "", version: 1
  },

  {
    id: "Q-V.1-08", bloc: "V", notion: "V.1", difficulte: 1, angle: "definition",
    enonce: "Choisissez la traduction correcte : « Le comité a pris une décision. »",
    choix: [
      "The committee made a decision.",
      "The comittee made a decision.",
      "The commitee made a decision.",
      "The committe made a decision."
    ],
    bonne: 0, ordreFixe: false,
    explication: "« Committee » désigne un groupe de personnes choisies pour prendre des décisions ou traiter un sujet. Il s'écrit avec trois lettres doublées : deux « m », deux « t » et deux « e ». « Comittee » n'a qu'un « m », « commitee » n'a qu'un « t », et « committe » n'a qu'un « e ».",
    aRetenir: "committee : mm, tt, ee.",
    references: [{ texte: "Oxford Learner's Dictionaries, entrée « committee »", article: "" }],
    source: "https://www.oxfordlearnersdictionaries.com/definition/english/committee",
    piege: "Oublier l'une des trois lettres doublées.",
    voirAussi: [],
    nature: "stable", verifieLe: "2026-10-21", statut: "valide", raisonAVerifier: "", version: 1
  },

  {
    id: "Q-V.1-09", bloc: "V", notion: "V.1", difficulte: 2, angle: "distinction",
    enonce: "Choisissez la traduction correcte : « Les dépenses publiques ont augmenté. »",
    choix: [
      "Public spending has risen.",
      "Public spendings have risen.",
      "Public depenses have risen.",
      "Public spending has raised."
    ],
    bonne: 0, ordreFixe: false,
    explication: "Les dépenses publiques se disent « public spending ». « Spending » est indénombrable : il ne prend pas de « s » et s'accorde au singulier (« has »), d'où l'erreur de « spendings have ». « Depenses » est un calque du français qui n'existe pas en anglais. « Rise » (rose, risen) est intransitif et convient pour « augmenter » sans complément. « Raise » est transitif : on augmente quelque chose (« raise taxes ») ; « spending has raised » est donc incorrect.",
    aRetenir: "public spending (indénombrable, verbe au singulier) ; rise = augmenter (sans complément), raise = augmenter quelque chose.",
    references: [
      { texte: "Oxford Learner's Dictionaries, entrée « spending »", article: "" },
      { texte: "Oxford Learner's Dictionaries, entrée « rise » (verbe)", article: "" }
    ],
    source: "https://www.oxfordlearnersdictionaries.com/definition/english/spending",
    piege: "Mettre « spending » au pluriel et confondre « rise » et « raise ».",
    voirAussi: ["V.4"],
    nature: "stable", verifieLe: "2026-10-21", statut: "valide", raisonAVerifier: "", version: 1
  },

  {
    id: "Q-V.1-10", bloc: "V", notion: "V.1", difficulte: 2, angle: "distinction",
    enonce: "Choisissez la traduction correcte : « Les candidats doivent assister à une réunion d'information. »",
    choix: [
      "Candidates must attend an information meeting.",
      "Candidates must assist an information meeting.",
      "Candidates must assist to an information meeting.",
      "Candidates must attend to an information meeting."
    ],
    bonne: 0, ordreFixe: false,
    explication: "« Assister à » un événement se dit « attend », suivi directement de son complément, sans préposition : « attend a meeting ». « Assist » est un faux ami : il signifie aider quelqu'un ou faciliter quelque chose. « Assist to » ajoute en plus une préposition calquée sur le français. « Attend to something » signifie prêter attention à quelque chose ou s'en occuper, pas être présent à une réunion.",
    aRetenir: "assister à = attend (sans préposition) ; assist = aider.",
    references: [
      { texte: "Oxford Learner's Dictionaries, entrée « attend »", article: "" },
      { texte: "Oxford Learner's Dictionaries, entrée « assist » (verbe)", article: "" }
    ],
    source: "https://www.oxfordlearnersdictionaries.com/definition/english/attend",
    piege: "Traduire « assister à » par « assist ».",
    voirAussi: ["V.5"],
    nature: "stable", verifieLe: "2026-10-21", statut: "valide", raisonAVerifier: "", version: 1
  },

  {
    id: "Q-V.1-11", bloc: "V", notion: "V.1", difficulte: 3, angle: "distinction",
    enonce: "Choisissez la traduction correcte : « Je cherche un emploi depuis trois mois. »",
    choix: [
      "I have been looking for a job for three months.",
      "I am looking for a job since three months.",
      "I have been looking for a job since three months.",
      "I look for a job for three months."
    ],
    bonne: 0, ordreFixe: false,
    explication: "Pour une action commencée dans le passé et qui dure encore, l'anglais emploie le present perfect (ici sa forme progressive, « have been looking »), là où le français emploie le présent. Devant une durée (« three months »), « depuis » se traduit par « for » ; « since » s'emploie seulement devant un point de départ (« since May », « since 2020 »). « I am looking ... since » cumule les deux erreurs : présent et « since ». « Have been looking ... since three months » a le bon temps, mais la mauvaise préposition. « I look for a job for three months » emploie à tort le présent simple.",
    aRetenir: "depuis + durée = present perfect + for ; depuis + point de départ = present perfect + since.",
    references: [{ texte: "Oxford Learner's Dictionaries, entrée « since », remarque sur since et for", article: "" }],
    source: "https://www.oxfordlearnersdictionaries.com/definition/english/since",
    piege: "Calquer le présent français et traduire « depuis » par « since » devant une durée.",
    voirAussi: ["V.2", "V.4"],
    nature: "stable", verifieLe: "2026-10-21", statut: "valide", raisonAVerifier: "", version: 1
  },

  {
    id: "Q-V.1-12", bloc: "V", notion: "V.1", difficulte: 3, angle: "distinction",
    enonce: "Choisissez la traduction correcte : « Le nombre de demandeurs d'emploi a baissé de 2 %. »",
    choix: [
      "The number of jobseekers has fallen by 2%.",
      "The number of jobseekers has fallen of 2%.",
      "The number of jobseekers has fallen from 2%.",
      "The number of jobseekers has fallen with 2%."
    ],
    bonne: 0, ordreFixe: false,
    explication: "Pour exprimer l'ampleur d'une variation (« de 2 % »), l'anglais emploie « by » : « prices went up by 10% », « has fallen by 2% ». « Of » est un calque du français « de ». « From » indique le point de départ de la variation : « has fallen from 2% » voudrait dire que le chiffre était de 2 % avant de baisser, ce qui change le sens. « With » ne s'emploie pas pour exprimer une variation.",
    aRetenir: "Variation de x % = by x % ; de A à B = from A to B.",
    references: [{ texte: "Oxford Learner's Dictionaries, entrée « by » (préposition), sens « degree or amount »", article: "" }],
    source: "https://www.oxfordlearnersdictionaries.com/definition/english/by",
    piege: "Traduire « de 2 % » par « of 2% » ou « from 2% ».",
    voirAussi: ["V.2"],
    nature: "stable", verifieLe: "2026-10-21", statut: "valide", raisonAVerifier: "", version: 1
  },

  /* ===================== V.2 — Prépositions ===================== */

  {
    id: "Q-V.2-02", bloc: "V", notion: "V.2", difficulte: 1, angle: "definition",
    enonce: "Complétez : « She is very interested ___ public finance. »",
    choix: ["in", "on", "for", "by"],
    bonne: 0, ordreFixe: false,
    explication: "L'adjectif « interested » se construit avec « in » : « interested in something ». « On » est un calque de « s'intéresser sur », qui est fautif en français comme en anglais. « For » est un calque de « intéressé par » ou « pour ». « By » introduit l'auteur d'une action au passif ; il n'introduit pas ce à quoi on s'intéresse.",
    aRetenir: "interested in, comme interest in.",
    references: [{ texte: "Oxford Learner's Dictionaries, entrée « interested »", article: "" }],
    source: "https://www.oxfordlearnersdictionaries.com/definition/english/interested",
    piege: "Calquer « intéressé par » en « interested by » ou « interested for ».",
    voirAussi: [],
    nature: "stable", verifieLe: "2026-10-21", statut: "valide", raisonAVerifier: "", version: 1
  },

  {
    id: "Q-V.2-03", bloc: "V", notion: "V.2", difficulte: 1, angle: "definition",
    enonce: "Complétez : « The tax office is closed ___ Sunday. »",
    choix: ["on", "in", "at", "by"],
    bonne: 0, ordreFixe: false,
    explication: "Devant un jour de la semaine ou une date, on emploie « on » : « on Sunday », « on 30 July ». « In » s'emploie devant un mois, une année ou une saison (« in January », « in 2026 »). « At » s'emploie devant une heure précise (« at 6 o'clock »). « By » signifie « au plus tard », ce qui ne convient pas pour un jour de fermeture.",
    aRetenir: "on + jour ou date ; in + mois, année ; at + heure.",
    references: [{ texte: "British Council, LearnEnglish, « Prepositions of time: at, in, on »", article: "" }],
    source: "https://learnenglish.britishcouncil.org/free-resources/grammar/a1-a2-grammar/prepositions-of-time-at-in-on",
    piege: "Employer « in » devant un jour de la semaine.",
    voirAussi: [],
    nature: "stable", verifieLe: "2026-10-21", statut: "valide", raisonAVerifier: "", version: 1
  },

  {
    id: "Q-V.2-04", bloc: "V", notion: "V.2", difficulte: 1, angle: "definition",
    enonce: "Complétez : « The new regulation came into force ___ 2024. »",
    choix: ["in", "on", "at", "since"],
    bonne: 0, ordreFixe: false,
    explication: "Devant une année, on emploie « in » : « in 2016 », « in 2024 ». « On » s'emploie devant un jour ou une date précise, « at » devant une heure. « Since » marque le point de départ d'une situation qui dure encore et s'emploie avec le present perfect ; il ne convient pas avec le prétérit « came », qui situe un événement ponctuel. « Come into force » signifie entrer en vigueur.",
    aRetenir: "in + année (in 2024) ; come into force = entrer en vigueur.",
    references: [
      { texte: "British Council, LearnEnglish, « Prepositions of time: at, in, on »", article: "" },
      { texte: "Oxford Learner's Dictionaries, entrée « force » (nom), expression « come into force »", article: "" }
    ],
    source: "https://learnenglish.britishcouncil.org/free-resources/grammar/a1-a2-grammar/prepositions-of-time-at-in-on",
    piege: "Mettre « since » sous l'influence de « depuis 2024 ».",
    voirAussi: ["V.5"],
    nature: "stable", verifieLe: "2026-10-21", statut: "valide", raisonAVerifier: "", version: 1
  },

  {
    id: "Q-V.2-05", bloc: "V", notion: "V.2", difficulte: 2, angle: "cas",
    enonce: "Complétez la formule de fin de courrier : « We look forward ___ hearing from you. »",
    choix: ["to", "for", "at", "on"],
    bonne: 0, ordreFixe: false,
    explication: "« Look forward to » signifie attendre avec plaisir ou avec impatience. Ici, « to » est une préposition : il est suivi d'un nom ou d'un verbe en -ing (« look forward to seeing you », « look forward to hearing from you »), jamais d'un infinitif. « For » est un calque de « attendre pour ». « At » et « on » ne forment pas cette expression.",
    aRetenir: "look forward to + -ing (to est ici une préposition).",
    references: [{ texte: "Oxford Learner's Dictionaries, entrée « look forward to »", article: "" }],
    source: "https://www.oxfordlearnersdictionaries.com/definition/english/look-forward-to",
    piege: "Croire que « to » annonce un infinitif et écrire « look forward to hear ».",
    voirAussi: [],
    nature: "stable", verifieLe: "2026-10-21", statut: "valide", raisonAVerifier: "", version: 1
  },

  {
    id: "Q-V.2-06", bloc: "V", notion: "V.2", difficulte: 2, angle: "distinction",
    enonce: "Complétez : « The report must be sent ___ Friday at the latest. »",
    choix: ["by", "until", "since", "for"],
    bonne: 0, ordreFixe: false,
    explication: "« By » signifie « au plus tard à, avant » : « finish the work by five o'clock ». Il convient avec « at the latest », pour une action qui doit être faite avant une échéance. « Until » signifie « jusqu'à » et marque la durée d'une situation qui continue jusqu'à ce moment (« the office is open until Friday ») ; il ne convient pas pour un envoi ponctuel. « Since » indique un point de départ passé, et « for » une durée.",
    aRetenir: "by Friday = au plus tard vendredi ; until Friday = jusqu'à vendredi (sans interruption).",
    references: [
      { texte: "Oxford Learner's Dictionaries, entrée « by » (préposition), sens « not later than »", article: "" },
      { texte: "Oxford Learner's Dictionaries, entrée « until »", article: "" }
    ],
    source: "https://www.oxfordlearnersdictionaries.com/definition/english/by",
    piege: "Traduire « jusqu'à vendredi » par « until » quand il s'agit d'une échéance.",
    voirAussi: [],
    nature: "stable", verifieLe: "2026-10-21", statut: "valide", raisonAVerifier: "", version: 1
  },

  {
    id: "Q-V.2-07", bloc: "V", notion: "V.2", difficulte: 2, angle: "distinction",
    enonce: "Complétez : « She has been working in Rouen ___ 2019. »",
    choix: ["since", "for", "ago", "during"],
    bonne: 0, ordreFixe: false,
    explication: "Avec le present perfect, « since » introduit le point de départ d'une situation qui dure encore : une date, un jour, une année (« since 2018 »). « For » introduit une durée (« for six years ») et ne peut pas précéder une année. « Ago » se place après une durée et s'emploie avec le prétérit (« six years ago »). « During » signifie « pendant » une période et ne marque pas un point de départ.",
    aRetenir: "since + point de départ (since 2019) ; for + durée (for six years).",
    references: [{ texte: "Oxford Learner's Dictionaries, entrée « since », remarque sur since et for", article: "" }],
    source: "https://www.oxfordlearnersdictionaries.com/definition/english/since",
    piege: "Confondre « since » (point de départ) et « for » (durée), tous deux traduits par « depuis ».",
    voirAussi: ["V.4"],
    nature: "stable", verifieLe: "2026-10-21", statut: "valide", raisonAVerifier: "", version: 1
  },

  {
    id: "Q-V.2-08", bloc: "V", notion: "V.2", difficulte: 1, angle: "definition",
    enonce: "Complétez : « The price of the ticket rose ___ 10 euros to 12 euros. »",
    choix: ["from", "of", "since", "at"],
    bonne: 0, ordreFixe: false,
    explication: "Pour indiquer le point de départ et le point d'arrivée d'une variation, on emploie « from … to … » : « inflation rose from 2 per cent to 5 per cent ». « Of » est un calque de « de » dans « de 10 à 12 euros ». « Since » est une préposition de temps, pas de quantité. « At » indique une valeur fixe (« sold at 10 euros »), pas une évolution.",
    aRetenir: "rise / fall from A to B ; rise / fall by x (ampleur).",
    references: [{ texte: "Oxford Learner's Dictionaries, entrée « rise » (verbe)", article: "" }],
    source: "https://www.oxfordlearnersdictionaries.com/definition/english/rise_1",
    piege: "Traduire « de 10 à 12 » par « of 10 to 12 ».",
    voirAussi: [],
    nature: "stable", verifieLe: "2026-10-21", statut: "valide", raisonAVerifier: "", version: 1
  },

  {
    id: "Q-V.2-09", bloc: "V", notion: "V.2", difficulte: 2, angle: "cas",
    enonce: "Complétez : « All companies must comply ___ the new accounting rules. »",
    choix: ["with", "to", "at", "of"],
    bonne: 0, ordreFixe: false,
    explication: "« Comply » signifie obéir à une règle ou à un ordre, respecter une norme, et se construit avec « with » : « comply with something ». « Comply to » est une faute fréquente, influencée par « se conformer à ». « At » et « of » ne se combinent pas avec ce verbe.",
    aRetenir: "comply with = se conformer à, respecter (une règle).",
    references: [{ texte: "Oxford Learner's Dictionaries, entrée « comply »", article: "" }],
    source: "https://www.oxfordlearnersdictionaries.com/definition/english/comply?q=comply",
    piege: "Calquer « se conformer à » en « comply to ».",
    voirAussi: ["V.5"],
    nature: "stable", verifieLe: "2026-10-21", statut: "valide", raisonAVerifier: "", version: 1
  },

  {
    id: "Q-V.2-10", bloc: "V", notion: "V.2", difficulte: 2, angle: "definition",
    enonce: "Complétez : « The manager was accused ___ fraud. »",
    choix: ["of", "for", "with", "about"],
    bonne: 0, ordreFixe: false,
    explication: "Le verbe « accuse » se construit avec « of » : « accuse somebody of something » (« She accused him of lying »). Au passif, on garde la même préposition : « was accused of fraud ». « For » est un calque de « accusé pour ». « With » et « about » ne s'emploient pas après « accuse ».",
    aRetenir: "accuse somebody of something ; be accused of.",
    references: [{ texte: "Oxford Learner's Dictionaries, entrée « accuse »", article: "" }],
    source: "https://www.oxfordlearnersdictionaries.com/definition/english/accuse",
    piege: "Écrire « accused for » sous l'influence du français.",
    voirAussi: [],
    nature: "stable", verifieLe: "2026-10-21", statut: "valide", raisonAVerifier: "", version: 1
  },

  {
    id: "Q-V.2-11", bloc: "V", notion: "V.2", difficulte: 3, angle: "cas",
    enonce: "Complétez : « The transfer of funds is subject ___ the approval of the finance committee. »",
    choix: ["to", "of", "at", "for"],
    bonne: 0, ordreFixe: false,
    explication: "L'adjectif « subject » suivi de « to » signifie « soumis à, sous réserve de » : une chose ne peut être faite ou acceptée que si une condition est remplie (« ready to publish, subject to your approval »). « Subject of » existe, mais c'est le nom « sujet de » (le sujet d'une discussion), qui ne convient pas ici. « At » et « for » ne forment pas cette expression.",
    aRetenir: "subject to = soumis à, sous réserve de.",
    references: [{ texte: "Oxford Learner's Dictionaries, entrée « subject » (adjectif)", article: "" }],
    source: "https://www.oxfordlearnersdictionaries.com/definition/english/subject_2",
    piege: "Confondre l'adjectif « subject to » avec le nom « the subject of ».",
    voirAussi: ["V.5"],
    nature: "stable", verifieLe: "2026-10-21", statut: "valide", raisonAVerifier: "", version: 1
  },

  {
    id: "Q-V.2-12", bloc: "V", notion: "V.2", difficulte: 3, angle: "cas",
    enonce: "Complétez : « In the event ___ a dispute, the parties will first try to reach an agreement. »",
    choix: ["of", "in", "for", "at"],
    bonne: 0, ordreFixe: false,
    explication: "L'expression figée « in the event of something » signifie « en cas de » : « In the event of an accident, call this number. » Elle est fréquente dans les textes administratifs et contractuels. « In the event in », « in the event for » et « in the event at » ne sont pas des expressions anglaises.",
    aRetenir: "in the event of = en cas de (registre soutenu).",
    references: [{ texte: "Oxford Learner's Dictionaries, entrée « event », expression « in the event of »", article: "" }],
    source: "https://www.oxfordlearnersdictionaries.com/us/definition/english/event",
    piege: "Hésiter sur la préposition d'une expression figée qu'on ne reconnaît pas.",
    voirAussi: ["V.5"],
    nature: "stable", verifieLe: "2026-10-21", statut: "valide", raisonAVerifier: "", version: 1
  },

  /* ===================== V.3 — Synonymes et antonymes ===================== */

  {
    id: "Q-V.3-02", bloc: "V", notion: "V.3", difficulte: 1, angle: "definition",
    enonce: "Dans la phrase « The new procedure will begin in January », quel verbe a le sens le plus proche de « begin » ?",
    choix: ["start", "finish", "stop", "delay"],
    bonne: 0, ordreFixe: false,
    explication: "« Begin » signifie commencer ; « start » est son synonyme le plus courant. « Finish » (finir) et « stop » (arrêter) en sont au contraire des antonymes. « Delay » signifie retarder ou reporter, ce qui ne correspond pas au fait de commencer.",
    aRetenir: "begin = start ; contraire : finish, end.",
    references: [{ texte: "Oxford Learner's Dictionaries, entrée « begin »", article: "" }],
    source: "https://www.oxfordlearnersdictionaries.com/definition/english/begin",
    piege: "Lire trop vite et choisir un verbe de la même famille de sens (le temps) sans vérifier.",
    voirAussi: [],
    nature: "stable", verifieLe: "2026-10-21", statut: "valide", raisonAVerifier: "", version: 1
  },

  {
    id: "Q-V.3-03", bloc: "V", notion: "V.3", difficulte: 1, angle: "definition",
    enonce: "Dans l'expression « an increase in taxes », quel nom est le contraire de « increase » ?",
    choix: ["decrease", "rise", "growth", "raise"],
    bonne: 0, ordreFixe: false,
    explication: "« Increase » désigne une hausse ; son contraire est « decrease », une baisse (« a decrease in spending »). « Rise » et « growth » sont des synonymes de « increase » : une hausse, une croissance. « Raise », nom formé sur le verbe « raise » (augmenter quelque chose), exprime lui aussi une hausse.",
    aRetenir: "increase ≠ decrease ; rise, growth = synonymes de increase.",
    references: [{ texte: "Oxford Learner's Dictionaries, entrée « decrease » (nom)", article: "" }],
    source: "https://www.oxfordlearnersdictionaries.com/definition/english/decrease_2",
    piege: "Chercher un synonyme alors que la question demande un contraire.",
    voirAussi: [],
    nature: "stable", verifieLe: "2026-10-21", statut: "valide", raisonAVerifier: "", version: 1
  },

  {
    id: "Q-V.3-04", bloc: "V", notion: "V.3", difficulte: 1, angle: "definition",
    enonce: "Dans la phrase « The department purchased new computers », quel verbe a le sens le plus proche de « purchased » ?",
    choix: ["bought", "sold", "rented", "lent"],
    bonne: 0, ordreFixe: false,
    explication: "« To purchase » signifie acheter ; c'est un équivalent plus formel de « to buy », dont le prétérit est « bought ». « Sold » (vendu) est le contraire. « Rented » signifie loué : on paie pour utiliser un bien sans l'acheter. « Lent » signifie prêté.",
    aRetenir: "purchase (formel) = buy ; contraire : sell.",
    references: [{ texte: "Oxford Learner's Dictionaries, entrée « purchase » (verbe)", article: "" }],
    source: "https://www.oxfordlearnersdictionaries.com/definition/english/purchase_1",
    piege: "Confondre acheter, louer et prêter, qui supposent tous un échange.",
    voirAussi: ["V.5"],
    nature: "stable", verifieLe: "2026-10-21", statut: "valide", raisonAVerifier: "", version: 1
  },

  {
    id: "Q-V.3-05", bloc: "V", notion: "V.3", difficulte: 2, angle: "distinction",
    enonce: "Dans la phrase « The company sells most of its products on the domestic market », quel adjectif est le contraire de « domestic » ?",
    choix: ["foreign", "home", "national", "internal"],
    bonne: 0, ordreFixe: false,
    explication: "Dans ce sens, « domestic » signifie « intérieur, national » : qui concerne l'intérieur d'un pays (« domestic flights », les vols intérieurs). Son contraire est « foreign » (étranger). « Home », « national » et « internal » sont au contraire des synonymes : « the home market » est aussi le marché intérieur. Le sens « domestique, ménager » existe aussi, mais il ne convient pas avec « market ».",
    aRetenir: "domestic market = marché intérieur ; contraire : foreign market.",
    references: [{ texte: "Oxford Learner's Dictionaries, entrée « domestic » (adjectif)", article: "" }],
    source: "https://www.oxfordlearnersdictionaries.com/definition/english/domestic_1",
    piege: "Comprendre « domestic » comme « domestique » au sens de « ménager ».",
    voirAussi: ["V.5"],
    nature: "stable", verifieLe: "2026-10-21", statut: "valide", raisonAVerifier: "", version: 1
  },

  {
    id: "Q-V.3-06", bloc: "V", notion: "V.3", difficulte: 2, angle: "distinction",
    enonce: "Dans la phrase « The figures in this report are accurate », quel adjectif a le sens le plus proche de « accurate » ?",
    choix: ["correct", "approximate", "careful", "recent"],
    bonne: 0, ordreFixe: false,
    explication: "« Accurate » signifie exact, correct et vrai dans tous ses détails ; son contraire est « inaccurate ». « Approximate » (approximatif) dit presque le contraire. « Careful » (soigneux, prudent) qualifie une personne ou une manière de faire, pas des chiffres. « Recent » (récent) porte sur la date, pas sur l'exactitude.",
    aRetenir: "accurate = exact, correct ; inaccurate = inexact.",
    references: [{ texte: "Oxford Learner's Dictionaries, entrée « accurate »", article: "" }],
    source: "https://www.oxfordlearnersdictionaries.com/definition/english/accurate",
    piege: "Associer « accurate » à « soigneux » parce qu'une personne exacte est souvent soigneuse.",
    voirAussi: [],
    nature: "stable", verifieLe: "2026-10-21", statut: "valide", raisonAVerifier: "", version: 1
  },

  {
    id: "Q-V.3-07", bloc: "V", notion: "V.3", difficulte: 2, angle: "distinction",
    enonce: "Dans la phrase « Attending the training session is optional », quel adjectif est le contraire de « optional » ?",
    choix: ["compulsory", "voluntary", "free", "possible"],
    bonne: 0, ordreFixe: false,
    explication: "« Optional » qualifie ce que l'on peut choisir de faire ou non ; son contraire est « compulsory », obligatoire (« Certain courses are compulsory; others are optional »). « Voluntary » (volontaire, facultatif) est proche de « optional ». « Free » peut vouloir dire « libre » ou « gratuit », mais ne signifie pas « obligatoire ». « Possible » n'exprime pas d'obligation.",
    aRetenir: "optional ≠ compulsory (obligatoire).",
    references: [{ texte: "Oxford Learner's Dictionaries, entrée « optional »", article: "" }],
    source: "https://www.oxfordlearnersdictionaries.com/definition/english/optional",
    piege: "Choisir « voluntary », qui est un synonyme et non un contraire.",
    voirAussi: [],
    nature: "stable", verifieLe: "2026-10-21", statut: "valide", raisonAVerifier: "", version: 1
  },

  {
    id: "Q-V.3-08", bloc: "V", notion: "V.3", difficulte: 2, angle: "definition",
    enonce: "Dans la phrase « We need to find out why the system failed », quel verbe a le sens le plus proche de « find out » ?",
    choix: ["discover", "invent", "hide", "repair"],
    bonne: 0, ordreFixe: false,
    explication: "« Find out » signifie obtenir une information, apprendre ou découvrir quelque chose en se renseignant ; « discover why… » a ce même sens (« We never did discover why she gave up her job »). « Invent » signifie créer quelque chose de nouveau. « Hide » (cacher) va à l'inverse. « Repair » (réparer) serait l'étape suivante, pas le fait d'identifier la cause.",
    aRetenir: "find out = discover (apprendre, découvrir une information).",
    references: [
      { texte: "Oxford Learner's Dictionaries, entrée « find out »", article: "" },
      { texte: "Oxford Learner's Dictionaries, entrée « discover »", article: "" }
    ],
    source: "https://www.oxfordlearnersdictionaries.com/definition/english/discover",
    piege: "Choisir « repair » en pensant à la suite logique de la phrase.",
    voirAussi: [],
    nature: "stable", verifieLe: "2026-10-21", statut: "valide", raisonAVerifier: "", version: 1
  },

  {
    id: "Q-V.3-09", bloc: "V", notion: "V.3", difficulte: 2, angle: "cas",
    enonce: "Dans la phrase « The agency hired twenty new employees last year », quel verbe a le sens le plus proche de « hired » ?",
    choix: ["employed", "dismissed", "trained", "promoted"],
    bonne: 0, ordreFixe: false,
    explication: "Appliqué à des personnes, « hire » signifie donner un emploi à quelqu'un, embaucher ; « employ » a le même sens. « Dismiss » signifie licencier, c'est le contraire. « Train » signifie former, et « promote » signifie promouvoir à un poste supérieur. En anglais britannique, « hire » veut aussi dire louer un objet (« hire a car »), mais ce sens ne convient pas avec « employees ».",
    aRetenir: "hire somebody = employ, recruit (embaucher) ; contraire : dismiss.",
    references: [{ texte: "Oxford Learner's Dictionaries, entrée « hire » (verbe)", article: "" }],
    source: "https://www.oxfordlearnersdictionaries.com/definition/english/hire_1",
    piege: "Penser uniquement au sens « louer » de « hire ».",
    voirAussi: ["V.5"],
    nature: "stable", verifieLe: "2026-10-21", statut: "valide", raisonAVerifier: "", version: 1
  },

  {
    id: "Q-V.3-10", bloc: "V", notion: "V.3", difficulte: 3, angle: "distinction",
    enonce: "Dans la phrase « The impact of the measure on prices was negligible », quel adjectif a le sens le plus proche de « negligible » ?",
    choix: ["insignificant", "careless", "considerable", "unexpected"],
    bonne: 0, ordreFixe: false,
    explication: "« Negligible » signifie négligeable : de très faible importance ou de très faible ampleur, au point qu'on peut ne pas en tenir compte ; son synonyme est « insignificant ». « Careless » (négligent, peu soigneux) traduit « négligent », un mot voisin par la forme mais différent par le sens. « Considerable » est le contraire. « Unexpected » (inattendu) ne dit rien de l'ampleur.",
    aRetenir: "negligible = négligeable (insignificant) ; négligent = careless, negligent.",
    references: [{ texte: "Oxford Learner's Dictionaries, entrée « negligible »", article: "" }],
    source: "https://www.oxfordlearnersdictionaries.com/definition/english/negligible",
    piege: "Confondre « negligible » (négligeable) et « négligent ».",
    voirAussi: ["V.5"],
    nature: "stable", verifieLe: "2026-10-21", statut: "valide", raisonAVerifier: "", version: 1
  },

  {
    id: "Q-V.3-11", bloc: "V", notion: "V.3", difficulte: 3, angle: "distinction",
    enonce: "Dans la phrase « Unemployment rose sharply in the region », quel adverbe donnerait le sens contraire de « sharply » ?",
    choix: ["slightly", "steeply", "dramatically", "significantly"],
    bonne: 0, ordreFixe: false,
    explication: "Appliqué à une variation, « sharply » signifie soudainement et dans une forte proportion (« Profits fell sharply »). Son contraire est « slightly », légèrement, un peu. « Steeply », « dramatically » et « significantly » expriment tous une variation forte ou marquée : ce sont des quasi-synonymes de « sharply », et non des contraires.",
    aRetenir: "rise sharply / steeply = fortement ; rise slightly = légèrement.",
    references: [
      { texte: "Oxford Learner's Dictionaries, entrée « sharply »", article: "" },
      { texte: "Oxford Learner's Dictionaries, entrée « slightly »", article: "" }
    ],
    source: "https://www.oxfordlearnersdictionaries.com/definition/english/sharply",
    piege: "Prendre « dramatically » pour « de façon dramatique » au sens négatif, et non « fortement ».",
    voirAussi: ["V.5"],
    nature: "stable", verifieLe: "2026-10-21", statut: "valide", raisonAVerifier: "", version: 1
  },

  {
    id: "Q-V.3-12", bloc: "V", notion: "V.3", difficulte: 1, angle: "definition",
    enonce: "Dans la phrase « She was offered a temporary contract », quel adjectif est le contraire de « temporary » ?",
    choix: ["permanent", "provisional", "short-term", "fixed-term"],
    bonne: 0, ordreFixe: false,
    explication: "« Temporary » qualifie ce qui ne dure, ou ne doit durer, que peu de temps ; son contraire est « permanent ». « Provisional » (provisoire), « short-term » (à court terme) et « fixed-term » (à durée déterminée) sont des synonymes ou des quasi-synonymes de « temporary ».",
    aRetenir: "temporary ≠ permanent ; fixed-term contract = contrat à durée déterminée.",
    references: [{ texte: "Oxford Learner's Dictionaries, entrée « temporary »", article: "" }],
    source: "https://www.oxfordlearnersdictionaries.com/definition/english/temporary",
    piege: "Choisir un synonyme alors que la question demande un contraire.",
    voirAussi: ["V.5"],
    nature: "stable", verifieLe: "2026-10-21", statut: "valide", raisonAVerifier: "", version: 1
  }

], { lot: "04-anglais-1" });
