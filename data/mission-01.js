(function () {
  const LEARN_ANSWER_ZH = {
    "Vacation.": "度假。", "I'm here on vacation.": "我是來度假的。", "I'm on vacation.": "我是來度假的。", "Yes.": "是。", "Yes, I am.": "是的。", "Yes, I do.": "有。",
    "Five days.": "五天。", "I'm staying for five days.": "我會待五天。", "ABC Hotel.": "ABC 飯店。", "At ABC Hotel.": "在 ABC 飯店。", "I'm staying at ABC Hotel.": "我住在 ABC 飯店。",
    "My wife.": "我太太。", "I'm traveling with my wife.": "我和我太太一起旅行。", "No.": "不是。", "No, I'm with my wife.": "不是，我和我太太一起。",
    "Yes, my wife.": "是的，和我太太。", "Yes, I'm traveling with my wife.": "是的，我和我太太一起旅行。", "Yes, my wife is.": "是的，我太太會一起。", "September 5.": "9 月 5 日。", "I'm leaving on September 5.": "我會在 9 月 5 日離開。",
    "Salesperson.": "業務員。", "A salesperson.": "一名業務員。", "I'm a salesperson.": "我是業務員。", "No, it's my first time.": "沒有，這是我第一次來。",
    "Here you go.": "給你。", "Yes, I do.": "有。", "No, I don't.": "沒有。", "No, I'm here for vacation.": "沒有，我是來度假的。",
    "No one.": "沒有人。", "I'm not visiting anyone.": "我沒有要拜訪任何人。", "Myself.": "我自己。", "I am.": "我自己支付。", "My company.": "我的公司。", "I'm paying for it myself.": "這趟旅行由我自己支付。",
    "I'm paying for the trip myself.": "這趟旅行由我自己付費。", "No, I'm paying for it myself.": "沒有，是我自己付費的。", "No, my wife is.": "不是，我太太會付費。",
    "Sightseeing.": "觀光。", "I'm planning to do some sightseeing.": "我打算去觀光。", "I'll be sightseeing.": "我會去觀光。",
    "Business.": "出差。", "I'm here for business.": "我是來出差的。", "I'm visiting family.": "我是來探望家人的。", "I'm visiting a friend.": "我是來拜訪朋友的。",
    "📕 遞出護照": "把護照交給入境官。", "📱 出示飯店訂房": "出示飯店訂房資料。", "🎫 出示回程機票": "出示回程機票。", "💵 拿出現金": "拿出現金。"
  };
  const learnPhrase = text => ({ text, zh: LEARN_ANSWER_ZH[text] || "（中文說明待補）" });
  const options = (id, correct, distractors) => [{ id: `${id}_correct`, ...learnPhrase(correct), isCorrect: true }, ...distractors.map((text, index) => ({ id: `${id}_d${index + 1}`, ...learnPhrase(text), isCorrect: false }))];
  const answerPair = (preferredAnswer, answerType, extra) => {
    if (answerType === "action") { const sentenceAnswer = extra.sentenceAnswer || "Here you go."; return { simpleAnswer: null, sentenceAnswer, learnAnswers: { action: learnPhrase(preferredAnswer), sentence: learnPhrase(sentenceAnswer) } }; }
    const defaults = {
      "Vacation.": ["Vacation.", "I'm here on vacation."],
      "Yes.": ["Yes.", "Yes, I am."],
      "Five days.": ["Five days.", "I'm staying for five days."],
      "ABC Hotel.": ["ABC Hotel.", "I'm staying at ABC Hotel."],
      "My wife.": ["My wife.", "I'm traveling with my wife."],
      "No, I'm with my wife.": ["No.", "No, I'm with my wife."],
      "Yes, my wife.": ["Yes.", "Yes, I'm traveling with my wife."],
      "I am.": ["I am.", "I'm paying for it myself."],
      "September 5.": ["September 5.", "I'm leaving on September 5."],
      "I'm a salesperson.": ["Salesperson.", "I'm a salesperson."],
      "No.": ["No.", "No, it's my first time."]
    };
    const [simpleAnswer, sentenceAnswer] = defaults[preferredAnswer] || [preferredAnswer, preferredAnswer];
    const resolvedSimple = extra.simpleAnswer || simpleAnswer, resolvedSentence = extra.sentenceAnswer || sentenceAnswer;
    return { simpleAnswer: resolvedSimple, sentenceAnswer: resolvedSentence, learnAnswers: { simple: learnPhrase(resolvedSimple), sentence: learnPhrase(resolvedSentence) } };
  };
  const conversation = (id, text, zhMeaning, preferredAnswer, distractors, answerType = "speech", extra = {}) => ({
    id, text, zhMeaning, answerType, preferredAnswer,
    acceptableAnswers: extra.acceptableAnswers || [preferredAnswer],
    correctOptionId: `${id}_correct`, options: options(id, preferredAnswer, distractors),
    ...answerPair(preferredAnswer, answerType, extra),
    recoveryNext: extra.recoveryNext || null, optionalRescue: null, difficulty: extra.difficulty || "core"
  });
  const link = (from, to) => (from.recoveryNext = to, from);
  const scenario = (id, icon, title, intentHint, variants, alternatives = [], group = "core") => ({ id, icon, title, intentHint, variants, alternatives: alternatives.map(learnPhrase), group, followUpScenarioId: null });

  const passportRecovery = conversation("passport_recovery", "Your passport, please.", "請出示護照。", "📕 遞出護照", ["📱 出示飯店訂房", "🎫 出示回程機票", "💵 拿出現金"], "action"); link(passportRecovery, passportRecovery);
  const purposeOpenRecovery = conversation("purpose_open_recovery", "What's the purpose of your visit?", "你這次來的目的是什麼？", "Vacation.", ["Five days.", "At ABC Hotel.", "My wife."]); link(purposeOpenRecovery, purposeOpenRecovery);
  const purposeYesNoRecovery = conversation("purpose_yesno_recovery", "Are you here for vacation?", "你是來度假的嗎？", "Yes.", ["No.", "Five days.", "ABC Hotel."], "speech", { acceptableAnswers: ["Yes.", "Yes, I am."] }); link(purposeYesNoRecovery, purposeYesNoRecovery);
  const purposeChoiceRecovery = conversation("purpose_choice_recovery", "Business or vacation?", "你是出差還是度假？", "Vacation.", ["Business.", "Five days.", "ABC Hotel."], "speech", { acceptableAnswers: ["Vacation.", "Pleasure."] }); link(purposeChoiceRecovery, purposeChoiceRecovery);
  const lengthRecovery = conversation("length_recovery", "How long are you staying?", "你會停留多久？", "Five days.", ["September 5.", "ABC Hotel.", "My wife."]); link(lengthRecovery, lengthRecovery);
  const hotelRecovery = conversation("hotel_recovery", "Which hotel are you staying at?", "你住哪一間飯店？", "ABC Hotel.", ["Five days.", "September 5.", "My wife."]); link(hotelRecovery, hotelRecovery);
  const companionOpenRecovery = conversation("companion_open_recovery", "Who are you traveling with?", "你和誰一起旅行？", "My wife.", ["Five days.", "ABC Hotel.", "September 5."], "speech", { acceptableAnswers: ["My wife.", "I'm traveling with my wife."] });
  const companionAloneRecovery = conversation("companion_alone_recovery", "Are you traveling alone?", "你是一個人旅行嗎？", "No, I'm with my wife.", ["Yes, I am.", "Five days.", "ABC Hotel."], "speech", { acceptableAnswers: ["No.", "No, I'm with my wife."] }); link(companionOpenRecovery, companionAloneRecovery); link(companionAloneRecovery, companionAloneRecovery);
  const companionAnyoneRecovery = conversation("companion_anyone_recovery", "Are you traveling with anyone?", "你有和任何人一起旅行嗎？", "Yes, my wife.", ["No.", "Five days.", "ABC Hotel."], "speech", { acceptableAnswers: ["Yes.", "Yes, my wife."] }); link(companionAnyoneRecovery, companionAnyoneRecovery);
  const departureRecovery = conversation("departure_recovery", "When is your flight home?", "你的返程班機是什麼時候？", "September 5.", ["Five days.", "ABC Hotel.", "Vacation."]); link(departureRecovery, departureRecovery);
  const jobRecovery = conversation("job_recovery", "What's your job?", "你的職業是什麼？", "I'm a salesperson.", ["I'm on vacation.", "Five days.", "ABC Hotel."]); link(jobRecovery, jobRecovery);
  const visitBeforeRecovery = conversation("visit_before_recovery", "Have you visited before?", "你以前來訪過嗎？", "No.", ["Yes.", "Five days.", "ABC Hotel."], "speech", { acceptableAnswers: ["No.", "No, it's my first time."] }); link(visitBeforeRecovery, visitBeforeRecovery);
  const visitFirstRecovery = conversation("visit_first_recovery", "Is this your first time here?", "這是你第一次來嗎？", "Yes.", ["No.", "Five days.", "ABC Hotel."], "speech", { acceptableAnswers: ["Yes.", "Yes, it is."] }); link(visitFirstRecovery, visitFirstRecovery);

  const passport = ["Passport, please.", "May I see your passport, please?", "Can I see your passport?"].map((text, i) => link(conversation(`passport_${i + 1}`, text, "請出示護照。", "📕 遞出護照", ["📱 出示飯店訂房", "🎫 出示回程機票", "💵 拿出現金"], "action"), passportRecovery));
  const purpose = [
    ...["What's the purpose of your visit?", "What's the purpose of your trip?", "What brings you here?", "Why are you visiting?"].map((text, i) => link(conversation(`purpose_open_${i + 1}`, text, "你這次來的目的是什麼？", "Vacation.", ["Five days.", "At ABC Hotel.", "My wife."]), purposeOpenRecovery)),
    link(conversation("purpose_yesno", "Are you here for vacation?", "你是來度假的嗎？", "Yes.", ["No.", "Five days.", "ABC Hotel."], "speech", { acceptableAnswers: ["Yes.", "Yes, I am."] }), purposeYesNoRecovery),
    link(conversation("purpose_choice", "Business or pleasure?", "出差還是旅遊？", "Vacation.", ["Business.", "Five days.", "ABC Hotel."], "speech", { acceptableAnswers: ["Vacation.", "Pleasure."] }), purposeChoiceRecovery)
  ];
  const length = ["How long are you staying?", "How long will you be here?", "How many days are you staying?", "How long do you plan to stay?"].map((text, i) => link(conversation(`length_${i + 1}`, text, "你會停留多久？", "Five days.", ["September 5.", "ABC Hotel.", "My wife."]), lengthRecovery));
  const accommodation = ["Where are you staying?", "Where will you be staying?", "Which hotel are you staying at?", "Where are you staying while you're here?"].map((text, i) => link(conversation(`hotel_${i + 1}`, text, "你住在哪裡？", "ABC Hotel.", ["Five days.", "September 5.", "My wife."]), hotelRecovery));
  const companion = [
    link(conversation("companion_open", "Who are you traveling with?", "你和誰一起旅行？", "My wife.", ["Five days.", "ABC Hotel.", "September 5."], "speech", { acceptableAnswers: ["My wife.", "I'm traveling with my wife."] }), companionOpenRecovery),
    link(conversation("companion_alone", "Are you traveling alone?", "你是一個人旅行嗎？", "No, I'm with my wife.", ["Yes, I am.", "Five days.", "ABC Hotel."], "speech", { acceptableAnswers: ["No.", "No, I'm with my wife."] }), companionAloneRecovery),
    link(conversation("companion_anyone", "Are you traveling with anyone?", "你有和任何人一起旅行嗎？", "Yes, my wife.", ["No.", "Five days.", "ABC Hotel."], "speech", { acceptableAnswers: ["Yes.", "Yes, my wife."] }), companionAnyoneRecovery),
    link(conversation("companion_here", "Who are you here with?", "你和誰一起來？", "My wife.", ["Five days.", "ABC Hotel.", "September 5."], "speech", { acceptableAnswers: ["My wife.", "I'm traveling with my wife."] }), companionOpenRecovery)
  ];
  const departure = ["When are you leaving?", "When are you going back?", "When is your flight home?"].map((text, i) => link(conversation(`departure_${i + 1}`, text, "你什麼時候離開？", "September 5.", ["Five days.", "ABC Hotel.", "Vacation."]), departureRecovery));
  const occupation = ["What do you do?", "What's your job?", "What do you do for work?", "What kind of work do you do?"].map((text, i) => link(conversation(`job_${i + 1}`, text, "你的工作是什麼？", "I'm a salesperson.", ["I'm on vacation.", "Five days.", "ABC Hotel."]), jobRecovery));
  const previousVisit = [
    ...["Have you been here before?", "Have you visited before?"].map((text, i) => link(conversation(`visit_before_${i + 1}`, text, "你以前來過這裡嗎？", "No.", ["Yes.", "Five days.", "ABC Hotel."], "speech", { acceptableAnswers: ["No.", "No, it's my first time."] }), visitBeforeRecovery)),
    ...["Is this your first time here?", "Is this your first visit?"].map((text, i) => link(conversation(`visit_first_${i + 1}`, text, "這是你第一次來嗎？", "Yes.", ["No.", "Five days.", "ABC Hotel."], "speech", { acceptableAnswers: ["Yes.", "Yes, it is."] }), visitFirstRecovery))
  ];

  const ticketRecovery = conversation("return_ticket_recovery", "Do you have a return ticket?", "你有回程機票嗎？", "Yes, I do.", ["No, I don't.", "September 5.", "ABC Hotel."], "speech", { simpleAnswer: "Yes.", sentenceAnswer: "Yes, I do." }); link(ticketRecovery, ticketRecovery);
  const ticketActionRecovery = conversation("return_ticket_action_recovery", "Your return ticket, please.", "請出示你的回程機票。", "🎫 出示回程機票", ["📕 遞出護照", "📱 出示飯店訂房", "💵 拿出現金"], "action"); link(ticketActionRecovery, ticketActionRecovery);
  const returnTicket = [
    link(conversation("return_ticket_1", "Do you have a return ticket?", "你有回程機票嗎？", "Yes, I do.", ["No, I don't.", "September 5.", "ABC Hotel."], "speech", { simpleAnswer: "Yes.", sentenceAnswer: "Yes, I do." }), ticketRecovery),
    link(conversation("return_ticket_2", "Do you have a ticket home?", "你有回程的機票嗎？", "Yes, I do.", ["No, I don't.", "Five days.", "ABC Hotel."], "speech", { simpleAnswer: "Yes.", sentenceAnswer: "Yes, I do." }), ticketRecovery),
    link(conversation("return_ticket_3", "Do you have proof of onward travel?", "你有後續離境行程的證明嗎？", "Yes, I do.", ["No, I don't.", "September 5.", "Vacation."], "speech", { simpleAnswer: "Yes.", sentenceAnswer: "Yes, I do." }), ticketRecovery),
    link(conversation("return_ticket_4", "Can I see your return ticket?", "可以讓我看你的回程機票嗎？", "🎫 出示回程機票", ["📕 遞出護照", "📱 出示飯店訂房", "💵 拿出現金"], "action"), ticketActionRecovery)
  ];
  const contactNoRecovery = conversation("local_contact_no_recovery", "Do you know anyone here?", "你在這裡有認識的人嗎？", "No, I don't.", ["Yes, my wife.", "Myself.", "Sightseeing."], "speech", { simpleAnswer: "No.", sentenceAnswer: "No, I don't." }); link(contactNoRecovery, contactNoRecovery);
  const contactVisitRecovery = conversation("local_contact_visit_recovery", "Are you visiting anyone here?", "你這次有要拜訪這裡的親友嗎？", "No, I'm here for vacation.", ["Yes, my wife.", "Myself.", "ABC Hotel."], "speech", { simpleAnswer: "No.", sentenceAnswer: "No, I'm here for vacation." }); link(contactVisitRecovery, contactVisitRecovery);
  const localContact = [
    link(conversation("local_contact_1", "Do you know anyone here?", "你在這裡有認識的人嗎？", "No, I don't.", ["Yes, my wife.", "Myself.", "Sightseeing."], "speech", { simpleAnswer: "No.", sentenceAnswer: "No, I don't." }), contactNoRecovery),
    link(conversation("local_contact_2", "Do you have a local contact?", "你在這裡有當地聯絡人嗎？", "No, I don't.", ["Yes, I do.", "Myself.", "Sightseeing."], "speech", { simpleAnswer: "No.", sentenceAnswer: "No, I don't." }), contactNoRecovery),
    link(conversation("local_contact_3", "Are you visiting anyone here?", "你這次有要拜訪這裡的親友嗎？", "No, I'm here for vacation.", ["Yes, my wife.", "Myself.", "ABC Hotel."], "speech", { simpleAnswer: "No.", sentenceAnswer: "No, I'm here for vacation." }), contactVisitRecovery),
    link(conversation("local_contact_4", "Who are you visiting?", "你這次要拜訪誰？", "No one.", ["My wife.", "A salesperson.", "ABC Hotel."], "speech", { simpleAnswer: "No one.", sentenceAnswer: "I'm not visiting anyone." }), contactVisitRecovery)
  ];
  const paymentSelfRecovery = conversation("payment_self_recovery", "Are you paying for the trip yourself?", "這趟旅行是你自己付費嗎？", "Yes, I am.", ["No, my wife is.", "Five days.", "Sightseeing."], "speech", { simpleAnswer: "Yes.", sentenceAnswer: "Yes, I am." }); link(paymentSelfRecovery, paymentSelfRecovery);
  const paymentNoRecovery = conversation("payment_no_recovery", "Is anyone else paying for your trip?", "有其他人幫你支付這趟旅行嗎？", "No, I'm paying for it myself.", ["Yes, my wife is.", "Five days.", "ABC Hotel."], "speech", { simpleAnswer: "No.", sentenceAnswer: "No, I'm paying for it myself." }); link(paymentNoRecovery, paymentNoRecovery);
  const tripPayment = [
    link(conversation("payment_1", "Who's paying for your trip?", "這趟旅行是誰付費的？", "I am.", ["My wife.", "My company.", "ABC Hotel."], "speech", { simpleAnswer: "I am.", sentenceAnswer: "I'm paying for it myself." }), paymentSelfRecovery),
    link(conversation("payment_2", "Who is paying for this trip?", "這趟旅行由誰支付？", "I am.", ["My wife.", "My company.", "Five days."], "speech", { simpleAnswer: "I am.", sentenceAnswer: "I'm paying for it myself." }), paymentSelfRecovery),
    link(conversation("payment_3", "Are you paying for the trip yourself?", "這趟旅行是你自己付費嗎？", "Yes, I am.", ["No, my wife is.", "Five days.", "Sightseeing."], "speech", { simpleAnswer: "Yes.", sentenceAnswer: "Yes, I am." }), paymentSelfRecovery),
    link(conversation("payment_4", "Is anyone else paying for your trip?", "有其他人幫你支付這趟旅行嗎？", "No, I'm paying for it myself.", ["Yes, my wife is.", "Five days.", "ABC Hotel."], "speech", { simpleAnswer: "No.", sentenceAnswer: "No, I'm paying for it myself." }), paymentNoRecovery)
  ];
  const planRecovery = conversation("trip_plan_recovery", "What are you planning to do here?", "你在這裡打算做什麼？", "Sightseeing.", ["Business.", "Five days.", "ABC Hotel."], "speech", { simpleAnswer: "Sightseeing.", sentenceAnswer: "I'm planning to do some sightseeing." }); link(planRecovery, planRecovery);
  const tripPlan = [
    link(conversation("trip_plan_1", "What are you planning to do here?", "你在這裡打算做什麼？", "Sightseeing.", ["Business.", "Five days.", "ABC Hotel."], "speech", { simpleAnswer: "Sightseeing.", sentenceAnswer: "I'm planning to do some sightseeing." }), planRecovery),
    link(conversation("trip_plan_2", "What are your plans while you're here?", "你在這裡期間有什麼計畫？", "Sightseeing.", ["Business.", "Five days.", "ABC Hotel."], "speech", { simpleAnswer: "Sightseeing.", sentenceAnswer: "I'm planning to do some sightseeing." }), planRecovery),
    link(conversation("trip_plan_3", "What will you be doing during your stay?", "你停留期間打算做什麼？", "Sightseeing.", ["Business.", "Five days.", "ABC Hotel."], "speech", { simpleAnswer: "Sightseeing.", sentenceAnswer: "I'll be sightseeing." }), planRecovery)
  ];

  window.MISSION_01 = {
    id: "mission-01", title: "順利通過入境審查", eyebrow: "MISSION 01", storageVersion: 4,
    traveler: { hasReturnTicket: true, localContact: "none", tripPaidBy: "self", tripPlan: "sightseeing" },
    tripProfile: [["此次出國目的", "Vacation", "度假"], ["停留天數", "5 days", "5天"], ["住宿地點", "ABC Hotel", "ABC飯店"], ["同行者", "Wife", "妻子"], ["回程日期", "September 5", "9月5日"], ["職業", "Salesperson", "銷售人員"], ["是否曾來過", "No", "第一次來"], ["當地聯絡人", "None", "沒有"], ["旅費支付", "Myself", "自己支付"], ["旅遊計畫", "Sightseeing", "觀光"]],
    survival: [["Sorry, could you say that again?", "可以再說一次嗎？"], ["Could you speak more slowly, please?", "可以說慢一點嗎？"], ["I'm sorry, I don't understand.", "不好意思，我沒聽懂。"]],
    scenarios: [
      scenario("passport", "📕", "出示護照", "他要看你的護照。", passport), scenario("purpose", "✈️", "旅行目的", "他想知道你來這裡做什麼。", purpose, ["Business.", "I'm here for business.", "I'm visiting family.", "I'm visiting a friend."]), scenario("length", "⏱️", "停留時間", "他想知道你會待多久。", length), scenario("accommodation", "🏨", "住宿地點", "他想知道你住在哪裡。", accommodation), scenario("companion", "👥", "同行者", "他想知道你和誰一起旅行。", companion), scenario("departure", "🎫", "回程／離境", "他想知道你什麼時候離開。", departure), scenario("occupation", "💼", "職業", "他想知道你的工作。", occupation), scenario("previous_visit", "🌎", "是否曾來過", "他想知道這是不是你第一次來。", previousVisit),
      scenario("return_ticket", "🎫", "回程機票", "他在確認你是否有離境安排。", returnTicket, [], "extension"), scenario("local_contact", "📍", "當地聯絡人", "他想知道你在當地是否有認識的人。", localContact, [], "extension"), scenario("trip_payment", "💳", "旅費支付", "他想知道誰支付這趟旅行。", tripPayment, [], "extension"), scenario("trip_plan", "🗺️", "旅行計畫", "他想知道你來了打算做什麼。", tripPlan, [], "extension")
    ]
  };
})();
