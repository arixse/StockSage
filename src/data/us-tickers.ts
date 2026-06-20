// Common US stock tickers for Reddit buzz matching
// Covers NYSE, NASDAQ, and AMEX listed stocks
// Last updated: 2026-06-20

export const usTickers: Set<string> = new Set([
  // ---------- Technology ----------
  "AAPL","MSFT","NVDA","AVGO","AMD","ADBE","CRM","ORCL","CSCO","INTC",
  "QCOM","TXN","INTU","NOW","AMAT","ADI","LRCX","KLAC","MU","SNPS",
  "CDNS","ADSK","PLTR","CRWD","PANW","FTNT","DDOG","WDAY","TEAM",
  "SNOW","MDB","ZS","NET","DELL","HPQ","NTAP","STX","WDC","ANET",
  "GLW","JBL","SWKS","QRVO","AKAM","FFIV","JNPR","TYL","PTC","ON",
  "MPWR","TER","ENPH","FSLR","SMCI","ZM","OKTA","DOCU","GEN","VRSN",
  "TDY","KEYS","TRMB","ZBRA","EPAM","GDDY","IT","SPLK","HUBS","DATA",
  "ESTC","CFLT","PATH","GTLB","HCP","U","S","BRZE","BILL","QTWO",
  "APP","AFRM","SOFI","COIN","RBLX","UEC","SNAP","PINS","TWLO","DBX",
  "RNG","BOX","ASAN","FRSH","PD","ZI","NCNO","FROG","SMAR","MNDY",
  "CYBR","CHKP","S","DT","DDOG","DTE","VEEV","PEGA","SPT","INST",

  // ---------- Communication Services ----------
  "META","GOOGL","GOOG","NFLX","DIS","CMCSA","VZ","T","TMUS","CHTR",
  "TTWO","EA","LYV","OMC","IPG","NWSA","FOXA","PARA","WBD","ROKU",
  "SPOT","SIRI","NYT","WWE","MTCH","BMBL","YELP","SNAP","PINS",
  "ZG","Z","CARG","TRIP","ANGI","FUBO","CURI",

  // ---------- Consumer Discretionary ----------
  "AMZN","TSLA","HD","MCD","NKE","LOW","BKNG","SBUX","TJX","MAR",
  "HLT","ABNB","ORLY","AZO","ROST","DHI","LEN","PHM","YUM","CMG",
  "DPZ","DRI","LULU","TSCO","ULTA","BBY","EBAY","GPC","KMX","CCL",
  "RCL","NCLH","EXPE","WYNN","MGM","LKQ","BWA","HAS","RL","TPR",
  "VFC","PTON","ETSY","CHWY","W","CVNA","RH","WSM","DECK","CROX",
  "DKS","GME","BBWI","ANF","GPS","AEO","URBN","FL","BOOT","HIBB",
  "ASO","PAG","AN","LAD","GPI","SAH","ABG","F","GM","TM","HMC",
  "STLA","RIVN","LCID","XPEV","NIO","LI","HOG","THO","WGO","PII",
  "BC","MBUU","MCFT",

  // ---------- Financials ----------
  "BRK.B","JPM","V","MA","BAC","WFC","GS","MS","AXP","BLK","SCHW",
  "C","CB","PGR","MMC","AON","AIG","MET","PRU","ALL","TRV","AFL",
  "BK","STT","TROW","PNC","USB","TFC","COF","DFS","SYF","NDAQ",
  "ICE","CME","MCO","SPGI","MSCI","FIS","FISV","PYPL","SQ","GPN",
  "FI","NTRS","RF","HBAN","CFG","KEY","FITB","MTB","EWBC","FHN",
  "WAL","CMA","ZION","SBNY","SIVB","FRC","HOOD","SOFI","AFRM",
  "UPST","LC","OPEN","UWMC","RKT","COOP","PFSI","WD","FNF","FAF",
  "STWD","BX","KKR","APO","ARES","OWL","TPG","CG","BAM","BN",
  "IVZ","BEN","LAZ","PJT","EVR","MC","SF","HLI","PIPR","JEF",

  // ---------- Healthcare ----------
  "LLY","UNH","JNJ","ABBV","MRK","TMO","ABT","DHR","PFE","AMGN",
  "ISRG","ELV","CI","CVS","HUM","BSX","GILD","VRTX","REGN","BIIB",
  "ILMN","IQV","A","IDXX","EW","BDX","SYK","MDT","ZTS","BAX",
  "HCA","UHS","CNC","MOH","CAH","COR","MCK","DGX","LH","DVA",
  "CHE","AMED","EHC","ENSG","NEO","NTRA","EXAS","GH","TDOC",
  "HIMS","RMD","PODD","DXCM","PEN","GKOS","ALGN","XRAY","NVST",
  "WST","AVTR","TECH","BIO","CRL","BRKR","AZTA","RGEN","TXG",
  "MRNA","BNTX","NVAX","VIR","SRPT","ALNY","IONS","BMRN","EXEL",
  "INCY","RARE","FOLD","BBIO","ARWR","BEAM","CRSP","NTLA","EDIT",
  "PFE","BMY","MRK","ABBV","AMGN","GILD","VRTX","BIIB","REGN",

  // ---------- Industrials ----------
  "CAT","RTX","UBER","GE","HON","UNP","UPS","BA","DE","LMT","ETN",
  "ADP","WM","ITW","MMM","FDX","NSC","CSX","GD","NOC","LHX","TT",
  "CARR","OTIS","JCI","CMI","PCAR","IR","ROK","PH","SWK","SNA",
  "FAST","DOV","EMR","AME","ROP","HWM","TDG","TXT","EFX","VRSK",
  "CPRT","PAYX","BR","XYL","IEX","GWW","URI","WSO","AOS","PNR",
  "NDSN","GGG","ITT","FLS","DCI","MSA","RPM","ACM","J","BLDR",
  "WCC","BCC","AIT","GATX","R","WAB","TRN","GBX","NSC","CNI",
  "DAL","UAL","AAL","LUV","JBLU","ALK","SAVE","SKYW","AZUL",

  // ---------- Consumer Staples ----------
  "WMT","PG","COST","KO","PEP","PM","MO","MDLZ","CL","EL","KMB",
  "GIS","HSY","KHC","K","SYY","MNST","STZ","KVUE","ADM","TSN",
  "DG","DLTR","WBA","CLX","CPB","SJM","MKC","HRL","TAP","CAG",
  "CHD","KR","BF.B","ACI","CASY","PSMT","BJ","COKE","CELH","SAM",
  "BUD","TAP","STZ","BF.A","MGPI","VGR","TPB","UVV","PM","MO",
  "BTI","IMBBY","NSRGY","UL","PG","CL","CLX","CHD","ECL","SPB",
  "ENR","CENT","CENTA","NWL","HELE","EL","COTY","ELF","IPAR",

  // ---------- Energy ----------
  "XOM","CVX","COP","EOG","SLB","MPC","PSX","VLO","OXY","HES",
  "PXD","WMB","OKE","KMI","HAL","BKR","DVN","FANG","MRO","APA",
  "CTRA","EQT","TRGP","OVV","PR","CHK","AR","RRC","SWN","MTDR",
  "CHRD","SM","MGY","CPE","NOG","CRK","GPOR","CRGY","HP","LBRT",
  "PTEN","NBR","RIG","NE","DO","VAL","SDRL","BORR","TDW","HLX",
  "HAL","SLB","BKR","WFRD","FTI","NOV","OII","DRQ","RES",

  // ---------- Real Estate ----------
  "PLD","AMT","EQIX","WELL","SPG","O","PSA","CCI","DLR","EXR",
  "AVB","EQR","VTR","ARE","MAA","UDR","CPT","INVH","SBAC","WY",
  "IRM","VICI","GLPI","BXP","KIM","REG","FRT","MAC","SKT","NNN",
  "STOR","EPR","LXP","CUZ","DEI","HIW","SLG","VNO","PGRE","BXP",
  "KRC","ARE","BMRN","ILMN",

  // ---------- Utilities ----------
  "NEE","SO","DUK","SRE","AEP","D","EXC","XEL","PEG","ED","EIX",
  "WEC","ES","DTE","PPL","FE","ETR","AEE","CNP","CMS","LNT","NI",
  "EVRG","PNW","AWK","CEG","NRG","AES","VST","ATO","CPK","NFG",
  "OGS","SR","SWX","MDU","BKH","OTTR","NJR","POR","AVA","ALE",
  "HE","NWE","IDA","MGEE","OGE","PNM","WTRG","SJW","AWR","CWT",

  // ---------- Materials ----------
  "LIN","SHW","FCX","NEM","APD","ECL","DOW","DD","NUE","VMC",
  "MLM","CTVA","PPG","BLL","LYB","IFF","EMN","PKG","IP","AMCR",
  "CF","MOS","FMC","ALB","SCCO","GOLD","AEM","FNV","WPM","RGLD",
  "KGC","AU","HMY","GFI","BTG","AGI","SBSW","PAAS","HL","CDE",
  "WY","SEE","GPK","CCK","BERRY","SLGN","AVY","ATR","SON","REYN",
  "RGLD","OLN","AXTA","ASH","NEU","FUL","BCPC","IOSP","KWR","HWKN",
  "MTX","SXT","CBT","CC","KOP","HUN","WLK","LYB","DOW","CE",

  // ---------- ETFs (commonly discussed) ----------
  "SPY","QQQ","IWM","DIA","VTI","VOO","IVV","VEA","VWO","BND",
  "AGG","TLT","LQD","HYG","GLD","SLV","USO","UNG","EEM","EFA",
  "XLF","XLK","XLE","XLV","XLI","XLY","XLP","XLB","XLC","XLU",
  "XLRE","SOXX","SMH","IBB","XBI","XHB","XRT","ITB","KRE","XME",
  "TAN","ICLN","ARKK","ARKW","ARKG","ARKF","ARKX","TQQQ","SQQQ",
  "VXX","UVXY","SVXY","VIXM","VIG","VYM","SCHD","DGRO","SPHD",
  "JEPI","JEPQ","QYLD","XYLD","RYLD","DIVO","BST","BSTZ","GDX",
  "GDXJ","SIL","URA","CORN","WEAT","SOYB","DBA","DBC","GSG",
  "VNQ","SCHH","IYR","RWO","XLRE","MORT","REM","KBWY","SRET",
  "BIL","SHV","SHY","IEI","IEF","TLH","GOVT","MUB","VTEB","TFI",
  "LQD","VCIT","VCSH","IGIB","HYG","JNK","EMB","VWOB","BNDX",
  "ARKK","ARKW","ARKG","ARKF","ARKX","ARKQ","MOON","IPO","SPAC",
]);

// Common English words that look like tickers but aren't (for Reddit matching)
export const falseTickers: Set<string> = new Set([
  "A","I","FOR","THE","AND","ARE","NOT","YOU","ALL","CAN","WAS",
  "HAS","HAD","BUT","ITS","IT","TO","IN","IS","ON","BE","AT",
  "OR","BY","IF","WE","SO","NO","GO","BE","DO","UP","US","AM",
  "AN","AS","HE","HI","LO","ME","MY","OF","OH","OK","RE","TV",
  "CEO","CFO","CTO","COO","IPO","ETF","AI","EPS","PE","ROE",
  "USA","GDP","CPI","FED","SEC","FDA","NYC","NY","LA","DC","UK",
  "EU","PM","AM","YOY","QOQ","YTD","MTD","LIVE","CASH","DEBT",
  "NEWS","TA","FA","MACD","RSI","SMA","EMA","VWAP","DCA","FOMO",
  "ATH","ATL","ETF","IRA","ROTH","401K","HSA","FSA","IRS","LLC",
  "LTD","INC","CORP","NEW","NOW","ONE","TWO","TOP","BIG","BEST",
  "COVID","FINTWIT","DD","PUMP","DUMP","HODL","LMAO","LOL","IMO",
  "TLDR","PSA","EDIT","RIP","FWIW","AFAIK","IIRC","YOLO","TLDR",
  "WTF","STFU","LETS","GOAT","NFA","DYOR","DUE","CAGR","IRR",
  "NPV","DCF","EBITDA","GAAP","FCF","CAPM","WACC","DDM","DCF",
]);
