// 易経64卦のデータ
export interface HexagramData {
  name: string;
  chineseName: string;
  judgment: string;
  image: string;
  interpretation: string;
}

export const IChing64Hexagrams: HexagramData[] = [
  {
    name: "乾",
    chineseName: "乾為天",
    judgment: "乾は元いに亨り、貞しきに利ろし",
    image: "天行健なり、君子は以て自ら彊めて息まず",
    interpretation: "創造力と活力に満ちた時期。積極的な行動が成功をもたらします。"
  },
  {
    name: "坤",
    chineseName: "坤為地", 
    judgment: "坤は元いに亨り、牝馬の貞しきに利ろし",
    image: "地勢坤なり、君子は以て徳を厚くして物を載す",
    interpretation: "受容性と忍耐が重要。他者をサポートすることで成果を得られます。"
  },
  {
    name: "屯",
    chineseName: "水雷屯",
    judgment: "屯は元いに亨り、貞しきに利ろし",
    image: "雲雷屯なり、君子は以て経綸す",
    interpretation: "困難な状況ですが、忍耐強く取り組めば道は開けます。"
  },
  {
    name: "蒙",
    chineseName: "山水蒙",
    judgment: "蒙は亨る、我れ童蒙を求めず、童蒙我れを求む",
    image: "山下出泉蒙なり、君子は以て果行して徳を育す",
    interpretation: "学習と成長の時期。素直な心で教えを受け入れることが大切です。"
  },
  {
    name: "需",
    chineseName: "水天需",
    judgment: "需は有孚、光亨、貞吉、大川を渉るに利ろし",
    image: "雲上於天需なり、君子は以て飲食宴楽す",
    interpretation: "待つことの重要性。焦らず時機を待てば良い結果が得られます。"
  },
  {
    name: "訟",
    chineseName: "天水訟",
    judgment: "訟は有孚あって窒がる、中吉、終凶、大人を見るに利ろし",
    image: "天と水違行して訟なり、君子は以て事を作すに謀始す",
    interpretation: "争いや対立の時期。冷静な判断と妥協が解決への道です。"
  },
  {
    name: "師",
    chineseName: "地水師",
    judgment: "師は貞なり、丈人吉にして咎無し",
    image: "地中有水師なり、君子は以て民を容れて衆を畜う",
    interpretation: "統率力とリーダーシップが求められる時。組織をまとめる役割を果たしましょう。"
  },
  {
    name: "比",
    chineseName: "水地比",
    judgment: "比は吉なり、原筮元永貞、無咎",
    image: "地上有水比なり、先王は以て万国を建てて諸侯と親す",
    interpretation: "協力と調和の時期。他者との良好な関係が成功の鍵となります。"
  },
  {
    name: "小畜",
    chineseName: "風天小畜",
    judgment: "小畜は亨る、密雲雨らず、我が西郊より",
    image: "風行天上小畜なり、君子は以て文徳を懿くす",
    interpretation: "小さな蓄積が大きな力になる時。地道な努力が実を結びます。"
  },
  {
    name: "履",
    chineseName: "天沢履",
    judgment: "履は虎尾を踐んで人を咥まず、亨る",
    image: "上天下沢履なり、君子は以て上下を辨えて民志を定む",
    interpretation: "慎重な行動が必要。危険な状況でも正しい道を歩めば安全です。"
  },
  {
    name: "泰",
    chineseName: "地天泰",
    judgment: "泰は小往き大来る、吉亨",
    image: "天地交泰なり、后は以て天地の宜を財成して天地の宜に左右す",
    interpretation: "調和と繁栄の時期。すべてが順調に進み、大きな成果が期待できます。"
  },
  {
    name: "否",
    chineseName: "天地否",
    judgment: "否の匪人、君子の貞に利ろしからず、大往き小来る",
    image: "天地不交否なり、君子は以て倹徳して難を避け、栄以て禄を受けず",
    interpretation: "停滞と困難の時期。無理な行動は避け、時期を待つことが賢明です。"
  },
  {
    name: "同人",
    chineseName: "天火同人", 
    judgment: "同人於野亨り、大川を渉るに利ろし、君子の貞に利ろし",
    image: "天与火同人なり、君子は以て族を類して物を辨ず",
    interpretation: "協力と団結の時期。同じ志を持つ人々と力を合わせれば成功します。"
  },
  {
    name: "大有",
    chineseName: "火天大有",
    judgment: "大有は元いに亨る",
    image: "火在天上大有なり、君子は以て悪を遏め善を揚げ、天の休命に順う",
    interpretation: "大きな成功と繁栄の時期。豊かさを他者と分かち合うことが大切です。"
  },
  {
    name: "謙",
    chineseName: "地山謙",
    judgment: "謙は亨る、君子は終有り",
    image: "地中有山謙なり、君子は以て多を損じて寡を益し、物を称して施を平らかにす",
    interpretation: "謙虚さが成功をもたらす時期。自分を低く見せることで信頼を得られます。"
  },
  {
    name: "豫",
    chineseName: "雷地豫",
    judgment: "豫は侯を建てて師を行るに利ろし",
    image: "雷出地奮豫なり、先王は以て楽を作し徳を崇び、薦之を上帝に薦めて以て祖考に配す",
    interpretation: "喜びと満足の時期。周囲との調和を保ちながら成果を享受しましょう。"
  },
  {
    name: "随",
    chineseName: "沢雷随",
    judgment: "随は元いに亨り貞吉にして咎無し",
    image: "沢中有雷随なり、君子は以て向晦入宴息す",
    interpretation: "適応と柔軟性の時期。状況に応じて自分を変化させることで道が開けます。"
  },
  {
    name: "蠱",
    chineseName: "山風蠱",
    judgment: "蠱は元いに亨る、大川を渉るに利ろし",
    image: "山下有風蠱なり、君子は以て民を振徳して徳を育す",
    interpretation: "改革と修復の時期。古い体制を改め、新しい基盤を築く時です。"
  },
  {
    name: "臨",
    chineseName: "地沢臨",
    judgment: "臨は元いに亨り貞吉、八月に至りて凶有り",
    image: "沢上有地臨なり、君子は以て教思無窮にして容保民無疆",
    interpretation: "指導力を発揮する時期。他者を導き、良い影響を与えることができます。"
  },
  {
    name: "観",
    chineseName: "風地観",
    judgment: "観は盥して薦せず、有孚顒若",
    image: "風行地上観なり、先王は以て省方観民設教す",
    interpretation: "観察と学習の時期。広い視野で物事を見つめ、智慧を深めましょう。"
  },
  {
    name: "噬嗑",
    chineseName: "火雷噬嗑",
    judgment: "噬嗑は亨る、獄を用うるに利ろし",
    image: "雷電噬嗑なり、先王は以て明罰敕法す",
    interpretation: "決断と実行の時期。障害を取り除き、正義を貫くことが重要です。"
  },
  {
    name: "賁",
    chineseName: "山火賁",
    judgment: "賁は亨る、小利有る所往",
    image: "山下有火賁なり、君子は以て明庶政して敢て獄を折らず",
    interpretation: "美化と装飾の時期。外見を整え、魅力的な印象を与えることが有効です。"
  },
  {
    name: "剥",
    chineseName: "山地剥",
    judgment: "剥は往く利ろしからず",
    image: "山附於地剥なり、上は以て下を厚くして宅を安んず",
    interpretation: "衰退と剥離の時期。無理な行動は避け、基盤を固めることに集中しましょう。"
  },
  {
    name: "復",
    chineseName: "地雷復",
    judgment: "復は亨る、出入疾なく、朋来りて咎無し",
    image: "雷在地中復なり、先王は以て至日を閉じて商旅行かず",
    interpretation: "回復と再生の時期。新しいサイクルの始まりで、希望が見えてきます。"
  },
  {
    name: "無妄",
    chineseName: "天雷無妄",
    judgment: "無妄は元いに亨り貞に利ろし、其れ正しからざれば眚有り、往く利ろしからず",
    image: "天下雷行物与無妄なり、先王は以て茂対時育万物",
    interpretation: "誠実さと自然さの時期。偽りなく正直に行動することで良い結果を得られます。"
  },
  {
    name: "大畜",
    chineseName: "山天大畜",
    judgment: "大畜は貞に利ろし、家食らわず吉、大川を渉るに利ろし",
    image: "天在山中大畜なり、君子は以て多く前言往行を識して以て其の徳を畜う",
    interpretation: "大きな蓄積の時期。能力を磨き、将来に向けて準備を整えることが重要です。"
  },
  {
    name: "頤",
    chineseName: "山雷頤",
    judgment: "頤は貞吉、頤を観て自ら口実を求む",
    image: "山下有雷頤なり、君子は以て言語を慎み飲食を節す",
    interpretation: "栄養と養成の時期。心身を整え、自分自身を大切にケアしましょう。"
  },
  {
    name: "大過",
    chineseName: "沢風大過",
    judgment: "大過は棟橈る、往く利ろし所有り、亨る",
    image: "沢滅木大過なり、君子は以て独立して懼れず、世を遯れて悶まず",
    interpretation: "過度と極限の時期。困難な状況でも勇気を持って立ち向かうことが必要です。"
  },
  {
    name: "坎",
    chineseName: "坎為水",
    judgment: "習坎有孚、維心亨、行有尚",
    image: "水洊至習坎なり、君子は以て常徳を行い習教事す",
    interpretation: "困難と試練の時期。粘り強く継続することで道は開けるでしょう。"
  },
  {
    name: "離",
    chineseName: "離為火",
    judgment: "離は利貞亨、畜牝牛吉",
    image: "明両作離なり、大人は以て明を継いで四方を照らす",
    interpretation: "明晰と照明の時期。知識と洞察力を活かして周囲を導くことができます。"
  },
  {
    name: "咸",
    chineseName: "沢山咸", 
    judgment: "咸は亨り貞に利ろし、女を取るに吉",
    image: "山上有沢咸なり、君子は以て虚を受けて人に応ず",
    interpretation: "感応と共感の時期。心を開いて他者とつながることで良い関係が築けます。"
  },
  {
    name: "恒",
    chineseName: "雷風恒",
    judgment: "恒は亨り咎無し、貞に利ろし、往く利ろし所有り",
    image: "雷風恒なり、君子は以て立つ所を改めず",
    interpretation: "持続と恒常の時期。一貫した姿勢を保つことで信頼と成果を得られます。"
  },
  {
    name: "遯",
    chineseName: "天山遯",
    judgment: "遯は亨る、小貞に利ろし",
    image: "天下有山遯なり、君子は以て小人を遠ざけ、疾悪せずして厳なり",
    interpretation: "退却と距離の時期。不適切な状況から身を引くことが賢明な選択です。"
  },
  {
    name: "大壮",
    chineseName: "雷天大壮",
    judgment: "大壮は貞に利ろし",
    image: "雷在天上大壮なり、君子は以て非礼弗履",
    interpretation: "大きな力と勢いの時期。強さを正しい方向に向けることが重要です。"
  },
  {
    name: "晋",
    chineseName: "火地晋",
    judgment: "晋は康侯錫馬蕃庶、昼日三接",
    image: "明出地上晋なり、君子は以て自ら明徳を昭かにす",
    interpretation: "前進と昇進の時期。積極的に行動し、自分の能力を示すときです。"
  },
  {
    name: "明夷",
    chineseName: "地火明夷",
    judgment: "明夷は艱難に利ろし、貞",
    image: "明入地中明夷なり、君子は以て衆に莅みて用晦而明",
    interpretation: "困難と暗黒の時期。辛抱強く耐え忍ぶことで光明が見えてきます。"
  },
  {
    name: "家人",
    chineseName: "風火家人",
    judgment: "家人は女の貞に利ろし",
    image: "風自火出家人なり、君子は言有物而行有恒",
    interpretation: "家族と調和の時期。内的な絆を大切にし、基盤を固めることが重要です。"
  },
  {
    name: "睽",
    chineseName: "火沢睽",
    judgment: "睽は小事吉",
    image: "上火下沢睽なり、君子は以て同して異なり",
    interpretation: "対立と分離の時期。違いを認めながらも協力の道を見つけることが大切です。"
  },
  {
    name: "蹇",
    chineseName: "水山蹇",
    judgment: "蹇は西南に利ろし、東北に利ろしからず、大人を見るに利ろし、貞吉",
    image: "山上有水蹇なり、君子は以て身を反して徳を修む",
    interpretation: "困難と障害の時期。自分自身を見つめ直し、内面を磨くことに集中しましょう。"
  },
  {
    name: "解",
    chineseName: "雷水解",
    judgment: "解は西南に利ろし、往く利ろし所無くんば、其の来復するは吉、往く利ろし所有れば夙吉",
    image: "雷雨作解なり、君子は以て赦過宥罪",
    interpretation: "解決と解放の時期。問題が解決し、新しい希望が見えてきます。"
  },
  {
    name: "損",
    chineseName: "山沢損",
    judgment: "損は有孚、元吉無咎、可貞、利往、曷之用、二簋可用享",
    image: "山下有沢損なり、君子は以て忿を懲らし欲を窒ぐ",
    interpretation: "減損と犠牲の時期。何かを手放すことで、より大きな価値を得ることができます。"
  },
  {
    name: "益",
    chineseName: "風雷益",
    judgment: "益は往く利ろし、大川を渉るに利ろし",
    image: "風雷益なり、君子は以て善を見れば遷り、過有れば改む",
    interpretation: "増益と発展の時期。積極的な行動により大きな利益を得ることができます。"
  },
  {
    name: "夬",
    chineseName: "沢天夬",
    judgment: "夬は王庭に揚ぐ、孚号有り、厲有り、己邑に告ぐ、戎に即くに利ろしからず、往く利ろし所有り",
    image: "沢上於天夬なり、君子は以て禄を施し下に及ぼし、居徳則忌",
    interpretation: "決断と除去の時期。勇気を持って決断し、不要なものを取り除くときです。"
  },
  {
    name: "姤",
    chineseName: "天風姤",
    judgment: "姤は女壮なり、女を用うるに利ろしからず",
    image: "天下有風姤なり、后は以て命を施し四方に告ぐ",
    interpretation: "遭遇と出会いの時期。新しい人や機会との出会いが運命を変えるかもしれません。"
  },
  {
    name: "萃",
    chineseName: "沢地萃",
    judgment: "萃は亨る、王假有廟、大人を見るに利ろし亨、貞に利ろし、大牲を用うるに吉、往く利ろし所有り",
    image: "沢上於地萃なり、君子は以て除戎器戒不虞",
    interpretation: "集合と結集の時期。多くの人々や資源を集めて大きな目標を達成できます。"
  },
  {
    name: "升",
    chineseName: "地風升",
    judgment: "升は元いに亨る、大人を見るに利ろし、恤うること勿れ、南征吉",
    image: "地中生木升なり、君子は以て順徳を積み小以て高大を為す",
    interpretation: "上昇と成長の時期。段階的に成長し、高い地位や成果を達成できます。"
  },
  {
    name: "困",
    chineseName: "沢水困",
    judgment: "困は亨る、貞大人吉、咎無し、言有るも信ぜられず",
    image: "沢無水困なり、君子は以て志を致して命を遂ぐ",
    interpretation: "困窮と制限の時期。資源は限られていますが、精神力で乗り越えられます。"
  },
  {
    name: "井",
    chineseName: "水風井",
    judgment: "井は邑を改むるも井を改めず、無喪無得、往来井井、汔至亦未繘井、羸其瓶凶",
    image: "木上有水井なり、君子は以て民を労し相勧",
    interpretation: "持続と供給の時期。根本的な価値は変わらず、継続的な恩恵をもたらします。"
  },
  {
    name: "革",
    chineseName: "沢火革",
    judgment: "革は己日に至りて乃ち孚とせらる、元いに亨り貞に利ろし、悔亡ぶ",
    image: "沢中有火革なり、君子は以て暦明時",
    interpretation: "変革と改革の時期。根本的な変化が必要で、古いものを新しくするときです。"
  },
  {
    name: "鼎",
    chineseName: "火風鼎",
    judgment: "鼎は元吉亨",
    image: "木上有火鼎なり、君子は以て正位凝命",
    interpretation: "安定と確立の時期。新しい体制や秩序が確立され、繁栄が期待できます。"
  },
  {
    name: "震",
    chineseName: "震為雷",
    judgment: "震は亨る、震来虩虩、笑言啞啞、震驚百里、匕鬯を喪わず",
    image: "洊雷震なり、君子は以て恐懼修省",
    interpretation: "衝撃と覚醒の時期。突然の変化に驚きながらも、成長の機会として活かしましょう。"
  },
  {
    name: "艮",
    chineseName: "艮為山",
    judgment: "艮は其の背、其の身を獲ず、其の庭に行きて其の人を見ず、咎無し",
    image: "兼山艮なり、君子は以て思出其位を越えず",
    interpretation: "静止と瞑想の時期。動きを止めて内省し、自分の位置を確認することが重要です。"
  },
  {
    name: "漸",
    chineseName: "風山漸",
    judgment: "漸は女の帰くに吉、貞に利ろし",
    image: "山上有木漸なり、君子は以て賢徳に居り俗を善くす",
    interpretation: "段階的進歩の時期。急がず確実に進歩し、着実に目標に近づいていきます。"
  },
  {
    name: "帰妹",
    chineseName: "雷沢帰妹",
    judgment: "帰妹は征けば凶、利ろし所無し",
    image: "雷上有沢帰妹なり、君子は以て永終を知り敝を知る",
    interpretation: "不適切な結合の時期。感情に流されず、冷静に判断することが必要です。"
  },
  {
    name: "豊",
    chineseName: "雷火豊",
    judgment: "豊は亨る、王假之、憂うることなかれ、日中に宜し",
    image: "雷電皆至豊なり、君子は以て獄を折り刑を致す",
    interpretation: "豊かさと充実の時期。しかし絶頂期であることを忘れず、謙虚さを保ちましょう。"
  },
  {
    name: "旅",
    chineseName: "火山旅",
    judgment: "旅は小亨、旅の貞吉",
    image: "山上有火旅なり、君子は以て明慎して用刑して獄を留めず",
    interpretation: "旅行と一時的状況の時期。環境の変化に適応し、柔軟に対応することが大切です。"
  },
  {
    name: "巽",
    chineseName: "巽為風",
    judgment: "巽は小亨る、往く利ろし、大人を見るに利ろし",
    image: "随風巽なり、君子は以て申命行事",
    interpretation: "柔軟性と順応の時期。周囲の状況に合わせて柔軟に対応することで成功します。"
  },
  {
    name: "兌",
    chineseName: "兌為沢",
    judgment: "兌は亨り貞に利ろし",
    image: "麗沢兌なり、君子は以て朋友講習",
    interpretation: "喜びと満足の時期。他者との交流を楽しみ、喜びを分かち合いましょう。"
  },
  {
    name: "渙",
    chineseName: "風水渙",
    judgment: "渙は亨る、王假有廟、大川を渉るに利ろし、貞に利ろし",
    image: "風行水上渙なり、先王は以て享于帝立廟",
    interpretation: "散乱と分散の時期。混乱した状況を整理し、新しい秩序を作り出すときです。"
  },
  {
    name: "節",
    chineseName: "水沢節",
    judgment: "節は亨る、苦節は貞うすべからず",
    image: "沢上有水節なり、君子は以て制数度議徳行",
    interpretation: "制限と節度の時期。適切な制限を設けることで、より良い結果を得られます。"
  },
  {
    name: "中孚",
    chineseName: "風沢中孚",
    judgment: "中孚は豚魚吉、大川を渉るに利ろし、貞に利ろし",
    image: "沢上有風中孚なり、君子は以て獄を議し死を緩す",
    interpretation: "誠実と信頼の時期。心からの誠意と信頼が人々の心を動かします。"
  },
  {
    name: "小過",
    chineseName: "雷山小過",
    judgment: "小過は亨り貞に利ろし、小事を為すべし、大事を為すべからず",
    image: "山上有雷小過なり、君子は以て行過乎恭、喪過乎哀、用過乎倹",
    interpretation: "小さな過度の時期。大きなことは避け、小さなことに注意深く取り組みましょう。"
  },
  {
    name: "既済",
    chineseName: "水火既済",
    judgment: "既済は亨り小利貞、初吉終乱",
    image: "水在火上既済なり、君子は以て思患而予防之",
    interpretation: "完成と成就の時期。目標は達成されましたが、油断せず次の準備をしましょう。"
  },
  {
    name: "未済",
    chineseName: "火水未済",
    judgment: "未済は亨る、小狐汔済、其の尾を濡らす、利ろし所無し",
    image: "火在水上未済なり、君子は以て物を慎別居方",
    interpretation: "未完成と可能性の時期。まだ完成していませんが、継続すれば成功の可能性があります。"
  }
];