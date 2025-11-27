"use strict"

var myPlaneDetection

var timeout_showMessageErrorOnSOSforDuration

const VideosCut = {
  videosSelected: new Map()
}

const mapBaseAppID_to_AirVideo = new Map()

var lang = 0//navigator.language
var languageBeforeLogin = lang
var regionIndex = 0 //USA
const isInFrame = false
const returnAsNotManager = 0
const returnAsNotLoggedIn = 0
const startedARcamera = false

const showKeyword = ""

const isInLocalhost = location.hostname.indexOf("localhost") !== -1
const httpAddress = isInLocalhost ? "http://localhost:8080" : "https://umniverse.com"
const httpLinkAddress = isInLocalhost ? "http://localhost:8081" : "https://airvideos.xyz"
const httpLinkAddressWithParameters = isInLocalhost ? "https://localhost:8081/?" : "https://airvideos.xyz/?" //must use https locally!?!

const cdniverse = "https://storage.googleapis.com/cdniverse/";
var globalElementToHide

var uploadedAirVideosBaseApp
const PROGRAM_VERSION = 0
    , versionOnMyCompiler = 0
    , origServletInfo = "/"
    , uniqueSessionUID = crypto.randomUUID()

let INITIAL_baseAppID

var AIRVIDEOSIWSDK_COMMAND = 170 // COMMAND_WITHOUT_LOGIN
var nomeUtilizador=""
var userID
var loginClientID
var idsOfLogin //Umniverse
var cloudStorageLocation, cloudStorageLocationName

var confirmBeforeUnload

var deviceUniqueID

var showingWallsAndTable

var lastPopoverUniqueID, lastPopoverContent


var enteredExtractDataFromServer

var h1="",h2="",h3="",h4="AIRVIDEOS ",h5="",h6="",h7="",h8="",h9="",h10="",h11="",h12=""//for the uniqueID received from Servers
const   CREATE_USER = 1,
        LOGIN=2,
        RECOVER_PASSWORD=3

var grecaptcha

const flags = [
       {
          title: 'music in english'
          , image: cdniverse + "images/classes3d/wall_pictures/world_flags/20151118161037!Flag_of_the_United_States.svg"
          , code: "separated_Youtube_american"
          , name: "American"
          , ID :"americanID"
       }
       ,
       {
        title: 'music in italian'
        , image: cdniverse+"images/classes3d/wall_pictures/eu_flags/f16.svg"
        , code: "separated_Youtube_italian"
        , name: "Italian"
        , ID: "italianID"
       }
       ,
        {
        title: 'music in spanish'
        , image: cdniverse+"images/classes3d/wall_pictures/eu_flags/f25.svg"
        , code: "separated_Youtube_spanish"
        , name: "Spanish"
        , ID: "spanishID"
        }
        ,
        {
        title: 'music in english'
        , image: cdniverse+"images/classes3d/wall_pictures/eu_flags/f29.svg"
        , code: "separated_Youtube_english"
        , name: "English"
        , ID: "englishID"
        }
        ,
        {
        title: 'music in french'
        , image: cdniverse+"images/classes3d/wall_pictures/eu_flags/f10.svg"
        , code: "separated_Youtube_french"
        , name: "French"
        , ID: "frenchID"
        }
        ,
        {
        title: "music in portuguese "
        , image: cdniverse+"images/classes3d/wall_pictures/eu_flags/f22.svg"
        , code:  "separated_Youtube_portuguese"
        , name: "Portuguese"
        , ID: "portugueseID"
        }
        ]


const YTcollections = [
   {
    group:"Portugal", subGroup: "Fado", ID: "portugueseID"
    , list: ["X7TwcFgrlik Gonçalo Salgueiro - Chuva em Agosto"
					,"FKFnuhdaaRM Carminho - Uma vida noutra vida (Live Rudolstadt)"
					,"S2Ip-uUhaoI Mariza - Gente da minha Terra (Belém)"
					,"HxCifjkpnAc Carlos do Carmo + Camané - Por morrer uma andorinha"
					,"M-SBW3Rulzg Carminho no Lux"
					,"aiZ__8HSZsE Amália - Gaivota"
					,"2zO4b75jFLI Jorge Fernando & Amália Rodrigues - Ai Vida"
					,"TdL-MHtRzD4 Gisela João - Vieste do fim do mundo"
					,"IbO4E_FA8GI Ana Moura - Andorinhas"
					,"aaWBkNWrC-g Ricardo Ribeiro - Portugal"
			]}
    ,
    {
    group:"Portugal", subGroup: "Popular", ID: "portugueseID"
    , list: ["UWqgvwcVp_k Vitorino - Menina estás à janela"
    							,"MttPJS7LIUo Monda + Maro - Moreninha Alentejana"
    							,"lqAXfHtkaPs Cuca Roseta - Amor de domingo"
    							,"X7TwcFgrlik Gonçalo Salgueiro - X7TwcFgrlik"
    							,"EqkHgAsFJT4 Cante - É tão grande o Alentejo"
    							,"Io_RidA1mlI Zeca Afonso - Vejam bem"
    							,"i5YkO1TY9xA Adriano Correia de Oliveira - Cantar da Emigração"
    							,"kGvY4tqcgUQ Manuel Freire - Pedra Filosofal"
    							,"X-mFf9dXnUI Gisela João - Sr. Extra Terrestre"
    		]}
    ,
    {
    group:"Portugal", subGroup: "Religiosa", ID: "portugueseID"
    , list: ["-s3Szq3e49c Kyrie Eleison"
			, "QA9nZS_w9nA Confiarei"
			, "ZB_Iwlf__E4 Frei Hermano da Câmara - Ave Maria"
			, "GIVx45_14nk Pd. José Luís Borga - Guiado pela mão"
			, "gVs0QAODPx4 Taizé - Cantarei ao Senhor"
			, "S-H8m6RFNKU Cuca Roseta - Avé Maria"
			, "339uVhAbcis Fáfá de Belém - Nossa Senhora"
			, "CfDrQ67f-IE Santa Maria, Mãe do Senhor"
			]}
    ,
    {
    group:"Portugal", subGroup: "Brazil", ID: "portugueseID"
    , list: ["-ypIzdy1Bkc Paula Fernandes - Eu sem você"
		, "ygUuXtg98zA Ney Matogrosso - Sangue Latino"
		, "hdvheuHhF2U Chico Buarque - Tanto mar"
		, "j9UbE1slI-Q Caetano Veloso - Sózinho"
		, "8LAoFCAS2sg Maria Bethânia, Alcione - O meu amor"
		, "qKzMgWBkpgo Tânia Mara - Romaria"
		, "2E2Z5FUExpc Gal Costa & Tim Maia - Dia de domingo"
		]}
    ,
    {
    group:"Portugal", subGroup: "África", ID: "portugueseID"
    , list: ["dNVrdYGiULM Cesária Évora - Sodade"
			, "B5PsIN_FkF4 Mayra Andrade - Afeto"
			, "31eeFAM6wu8 Lura - Sabi di Más"
			, "0LPdvCyERDw Tito Paris - Mim Ê Bô"
			, "fhwVekYE4-I Bonga - Mulemba Xangola"
			, "-9DoqAGtPc8 Afro Panico 'Matimba' - Kuduru"
			, "W276kT7uMao Mr. Bow - Va Navela"
			, "cZqFy3ubQe0 Binhan - Guiné Nha Terra"
		    ]}
,
   {
   group:"Spain", subGroup: "Iglesias", ID: "spanishID"
    , list:  ["C1lBCd7hM1Y Julio Iglesias - Hey!"
		  , "3DV57Y4tEAM Enrique Iglesias - Experiencia religiosa"
		  , "39h9gl7GmuU Rodrigo Iglesias"
		  , "rhvkKHJlMRM Julio Iglesias - Me olvidé de vivir"
			]}
    ,
   {
   group:"Spain", subGroup: "Pablo Alborán", ID: "spanishID"
    , list: ["8EFMojiDY2k Perdôname (com Carminho)"
		  ,"-QerthBHl8A Saudades do Brasil em Portugal"
		  ,"F0rwOsAteXM Solamente Tú"
			]}
     ,
   {
   group:"Spain", subGroup: "Flamenco", ID: "spanishID"
    , list: ["D1tcc3wRtNE Angeles Toldano - Bulerias"
		    ,"cm9IYSDxagc Ballet Flamenco Andalucia"
		    ,"sFUC5ROtN8M Amazing Flamenco"
			,"txGObix4GTk Demarco Flamenco - Alegría"
			]}
    ,
   {
   group:"Spain", subGroup: "Sevillanas", ID: "spanishID"
    , list: ["3VljOe_DxsA Sevillanas De Carlos Saura - Actuales"
			, "Mu98e6dRuIo Sevillanas para Bailar, Conquistar"
			, "w-Mdh94DtSA Lúcia y Manuel (11 y 12 años)"
			, "dkRKy4oftNE Sevillana Biblica"
			]}
    ,
   {
   group:"Spain", subGroup: "Religiosa", ID: "spanishID"
    , list: ["scyXU-De_nM Los Gregorianos - Alma de Cristo"
			,"BOb0GZpq_M4 Hermana Glenda - Nada es imposible para Ti"
			,"tABpYjIjaXA Kiko canta a Juan Pablo II"
			,"lMI9DuuaYlM Alleluia"
			]}
    ,
   {
   group:"Spain", subGroup: "Religiosa", ID: "spanishID"
    , list: ["E-zcNpZJX78 Malu Trevejo - Luna Llena"
			,"XAhTt60W7qo Shakira - Loca"
			,"8kQZHYbZkLs Leo Rojas - El Condor Pasa"
			,"cIrGQD84F1g Mercedes Sosa - Gracias A La Vida"
			,"MepPfI7ebMY Astor Piazzolla - Libertango"
			,"VTPec8z5vdY Adios Nonino - Astor Piazzolla"
			,"tGbRZ73NvlY Buena Vista Social Club - Chan Chan"
			]}
    ,
   {
   group:"Spain", subGroup: "vários", ID: "spanishID"
   , list: ["GXAkzb4XT14 Joaquin Sabina - Contigo"
		  ,"0Ra_ea5wxfk Montserrat Caballé - Carmen"
		  ,"nR6CIYgEJbE Plácido Domingo - Granada"
		  ,"PWGwF_B0bxk Juan Luis - Burbujas De Amor"
		  ,"vCEvCXuglqo Ricky Martin - Maria"
		  ]}
   ,
    {
    group:"Italian", subGroup: "Eros Ramazzotti", ID: "italianID"
    , list: ["UojBaKX5Vz4 La Cosa Mas Bella"
		    ,"yrk-tcSLYKE Se bastasse una canzone"
			, "8w_E3fyzPnw Cose Della Vita"
		  ]}
   ,
    {
    group:"Italian", subGroup: "Laura Pausini", ID: "italianID"
    , list: ["0-3h5fGyT5o En Cambio No"
		  , "Df7RlTPJlQk Strani Amore, Lettera..."
		  , "m6fn3GoC85o Amores Extraños"
		  , "zLmFEIksvh8 Dare To Live"
		  ]}
   ,
    {
    group:"Italian", subGroup: "Andrea Bocelli", ID: "italianID"
    , list: ["qt_OkgSOrkU Céline Dion - The Prayer"
		   ,"SPizIaBPhSg Can't Help Falling In Love"
		   ,"eiDiKwbGfIY Ed Sheeran - Perfect Symphony"
		   ,"TdWEhMOrRpQ Con Te Partirò"
		   ,"e_rvQkM0_lU Cecilia Bartoli - Pianissimo"
			]}
     ,
    {
    group:"French", subGroup: "Belge", ID: "frenchID"
    , list: ["oR_SZR_tmxM Brel - Ne me quite pas"
		    ,"pYyReJaQCko Quand on n'a que l'amour"
			, "dU-OD5_Dxrs Brel - La chanson des vieux amants"
			]}
     ,
    {
    group:"French", subGroup: "Congolaise", ID: "frenchID"
    , list: ["hIB1DCydeOQ SIA MOSHA - Tarley ft Ntosh Gazi & Selecta Jeff"
		  , "luMk2qeOA38 Fulu Miziki kinshasa's music warriors"
		  , "RuilJouXcCM BANA CONGO - Donat Mwanza "
		  ]}
     ,
    {
    group:"French", subGroup: "Quebequoise", ID: "frenchID"
    , list: ["qJOvYMG53g0 Vigneault - Les gens de mon pays"
		   ,"QIeasPj-jb0 Vigneault - Tout le monde est malheureux"
		   ,"UcZx5hllihQ Vigneault - Mon pays (l'idée)"
		   ,"-aso5_-PdoI Vigneault - mon père m'a dit..."
			]}

         ,
    {
    group:"American", subGroup: "Elvis Presley", ID: "americanID"
    , list: ["ttuVUynl5SU  Can't Help Falling In Love"
		  , "61-RycNKdJk Unchained Melody"
		  , "ngHzBS2T4TA Love Me Tender"
		  , "wTRSlZEq_l0 Always On My Mind"
		  ]}
    ,
    {
    group:"American", subGroup: "Whithney Houston", ID: "americanID"
    , list: ["3JWTaaS7LdU I Will Always Love You"
		  , "6A2WQksCSWI That's what friends are for"
		  , "IYzlVDlE72w Greatest Love Of All"
		  , "LKaXY4IdZ40 When You Believe"
		  , "7L9EMe-7Z4w One Moment In Time"
		  ]}
    ,
    {
    group:"American", subGroup: "Rolling Stones", ID: "americanID"
    , list: ["Ef9QnZVpVd8 You Can’t Always Get What You Want"
		  , "SGyOaCXr8Lw Start me up"
		  , "nrIPxlFzDi0 Satisfaction"
		  , "RcZn2-bGXqQ Angie"
		  , "37_J7zpD2ks As tears go by"
 		  , "XirG-qwMCMc Lady Jane"
		  ]}
    ,
    {
    group:"American", subGroup: "John Denver", ID: "americanID"
    , list: ["IUmnTfsY3hI Take Me Home, Country Roads"
		   , "TyJRsp5t9mA Annie's Song"
		   , "g5sbTHMP0Ig Sunshine On My Shoulders"
		   , "bRe648clNjg Leaving On A Jet Plane"
		   , "zlKLtnbU0xE This Old Guitar"
		   , "-ZonmQZG0GQ Calypso"
		  ]}
       ,
    {
    group:"English", subGroup: "The Beatles", ID: "englishID"
    , list: ["NCtzkaL2t_Y Beatles - Don't let me down"
		  , "UelDrZ1aFeY Beatles - Something"
		  , "A_MjCqQoLLA Beatles - Hey jude"
		  , "VlFDNvOunGQ John Lennon + - Imagine"
		  ]}
       ,
    {
    group:"English", subGroup: "Queen", ID: "englishID"
    , list: ["v3xwCkhmies Love of my Life"
		  , "vbvyNnw8Qjg Live Aid 1985 Wembley Stadium"
		  , "OVzvoPP6M50 Under pressure"
		  , "uyd6OLyhPJo Spread your wings"
		  , "kijpcUv-b8M Somebody to love"
		  ]}
       ,
    {
    group:"English", subGroup: "Adele", ID: "englishID"
    , list: ["hLQl3WQQoQ0 Someone Like You"
		   , "U3ASj1L6_sY Easy On Me"
		   , "WjqYTpE6Qdg Set Fire to the Rain"
		   , "DDWKuo3gXMQ When We Were Young"
		   , "YQHsXMglC9A Hello"
		   , "jDvYDzFOK9A I Drink Wine"
		  ]}
       ,
    {
    group:"English", subGroup: "David Bowie", ID: "englishID"
    , list: ["bsYp9q3QNaQ Heroes"
		  , "oOKWF3IHu0I Starman"
		  , "iCJLOXqnT2I Absolute beginners"
		  , "X3F9BiiSKZw Blue Jean"
 		  , "_YC3sTbAPcU China girl"
		  , "4BgF7Y3q-as Changes"
		  ]}
]

//------------------------------------
function colorTrace(msg, color)
{
    consoleLogIfIsInLocalhost("%c" + msg, "color:" + color + ";font-weight:bold;")
}
//-----------------------------------------------------------------
function initialize_airvideos()
{
const params = new URLSearchParams(window.location.search)

INITIAL_baseAppID = params.get("baseappid")


if(INITIAL_baseAppID)
  {
    submit_AIRVIDEOSIWSDK_COMMAND("GET_BASEAPP_ID", INITIAL_baseAppID)
    showingWallsAndTable = false
  }
else
{
  showingWallsAndTable = true
const codes = window.localStorage.getItem("codes")

  if(codes)
  {
    let lastPos = 0
    while (lastPos < codes.length)
    {
      let pos = codes.indexOf(" ", lastPos)
      const code = codes.slice(lastPos, pos)
      lastPos = pos + 1
      pos = codes.indexOf(" ", lastPos)
      const numChars = parseInt(codes.slice(lastPos, pos))
      lastPos = pos + 1 + numChars
      const object = JSON.parse(codes.slice(pos + 1, lastPos))
      object.code = code  //just in case (old versions)
      VideosCut.videosSelected.set(code, object)
    }
    updateVideosIn2D()
  }

  if( VideosCut.videosSelected.size === 0)
    importFromPresetLists()
}

}
//-----------------------------------------------------------------
function showMessageErrorOnSOSforDuration(message, durationMS)
{
    showMessageOnSOSforDuration(message, durationMS, "red")
}
//-----------------------------------------------------------------
function showMessageOnSOSforDuration(message, durationMS = 3000, color = "black")
{
$("#top_message_duration").html("<b style='font-size:120%;color:" + color+ "'>" + message + "</b>");
if(timeout_showMessageErrorOnSOSforDuration)
  clearTimeout(timeout_showMessageErrorOnSOSforDuration)
timeout_showMessageErrorOnSOSforDuration = setTimeout(function()
  {
    timeout_showMessageErrorOnSOSforDuration = undefined
    $("#top_message_duration").html("")
  }, durationMS)

}
//-----------------------------------------------------------------------------
async function validYoutubeVideoId(id)
{
	const url = "https://img.youtube.com/vi/" + id + "/mqdefault.jpg";
	const { status } = await fetch(url);
	if (status === 404) return false;
	return true;
}
//-----------------------------------------------------------------
function extractYoutubeID(url, showError)
{

if(!url)
  return

if(url.charAt(url.length-1) == "/")
   url = url.slice(0, url.length-1)

let pos = -1
if(url.indexOf("https://youtu.be") != -1)
  pos = url.lastIndexOf("/")
else if(url.indexOf("youtube.com") != -1)
  {
	pos = url.lastIndexOf("?v=")
	pos = pos > -1 ? pos + 2 : url.lastIndexOf("/")
  }
if(pos < 1)
    {
	if(showError)
	   showMessageOnSOSforDuration("not a Youtube link", 3000)
    return ""
	}

let youtubeID = url.slice(pos + 1)

pos = youtubeID.indexOf("&")
if(pos != -1)
	youtubeID = youtubeID.slice(0, pos)

pos = youtubeID.indexOf("?")
if(pos != -1)
	youtubeID = youtubeID.slice(0, pos)

return youtubeID  //"M7lc1UVf-VE"
}
//-----------------------------------------------------------------
function changedInputToReceiveYoutubeURLorCode(code, event)
{

    const time = new Date().getTime()
    if(VideosCut.lastTime_changedInputToReceiveYoutubeURLorCode && time - VideosCut.lastTime_changedInputToReceiveYoutubeURLorCode < 1000)
        return
    VideosCut.lastTime_changedInputToReceiveYoutubeURLorCode = time

    if(code !== undefined)
        $("#inputToReceiveYoutubeURLorCode").val(code)
    else
        code = $("#inputToReceiveYoutubeURLorCode").val().trim()
    VideosCut.youtubeURLorCode = code
    if(!code)
        return importFromPresetLists()
    let ytCode = code.indexOf("/") == -1 ? code : extractYoutubeID(code)
    if(!ytCode)
        return showMessageErrorOnSOSforDuration("not a valid video", 2000)
    else if(VideosCut.videosSelected.get(ytCode))
        return showMessageErrorOnSOSforDuration("video already present", 2000)
    else validYoutubeVideoId(ytCode).then((success) =>
      {
        $("#inputToReceiveYoutubeURLorCode").val("")
        VideosCut.videosSelected.set(ytCode, {code: ytCode})
        updateVideosIn2D()
      })
}
//----------------------------------------
function removeYouTubeCode(ytCode)
{
  VideosCut.videosSelected.delete(ytCode)
  updateVideosIn2D()
}
//----------------------------------------
function updateVideosIn2D()
{
let s = ""
let codes = ""
const groupNameToS = new Map()
for(let [code, video] of VideosCut.videosSelected)
{
    const objectStr = JSON.stringify(video)
    if(!video.isFromCloud)
        codes += code + " " + objectStr.length + " " + objectStr

    const group = video.groupName + " - " + video.subGroupName
    let ID_toS = groupNameToS.get(group)
    if(!ID_toS)
        ID_toS = {toS: "", groupID: video.groupID, groupName: video.groupName, subGroupName: video.subGroupName}
    ID_toS.toS += "<table class='wm' style='display:inline-table;border:2px solid #red;margin:5px'><tr><th>"
          + "<table class='wm' style='width:100%'><td class='wm' style='width:1px;cursor:pointer' title='XR AirVideos!'><img onClick='world.launchXR()' src='https://storage.googleapis.com/cdniverse/images/WebXR/webxr.png' style='height:24px'></td>"
          + "<td class='wm text_ellipsis' style='max-width:150px'>" + (video.title || code) + "</td>"
          + "<td class='wm' onClick='removeYouTubeCode(\""+ code +"\")' style='cursor:pointer;color:red;width:1px'><b>&nbsp;X&nbsp;</b></td></tr></table>"
          + "</th></tr>"
        + "<tr><td><a target='_blank' href='"+youtubeURLfromCode(code)+"'><img class='img_airvideos_code_"+ code +"' src='"+getYoutubeImageURL(code)+"' crossorigin='anonymous' style='width:200px;aspect-ratio:200/150'></a></td></tr>"
        + "</table>"
    groupNameToS.set(group, ID_toS)
}

for(let [group, ID_toS] of groupNameToS)
   s += (ID_toS.groupID ? "<b style='font-size:120%;color:green'>" + group + " <font onClick='removeVideosWithGoupID(\""+ID_toS.groupID+"\", \""+ID_toS.subGroupName+"\")' style='cursor:pointer;color:red'>X</font></b><br>" : "")
        + ID_toS.toS + "<br>"

window.localStorage.setItem("codes", codes);

$("#show_videos_in_2D").html(s)
$("#2D-info-div-bottom").css("display", VideosCut.videosSelected.size ? "none" : "")
}
//----------------------------------------
function importFromPresetLists()
{

    let s = ""
    for(let flag of flags)
    {
       let selectSubGroup = "<select onChange='if(this.value !== \"none\") importVideosFromID(\""+flag.ID+"\", this.value);this.value=\"none\"'><option value='none'>choose subgroup</option>"
       for(let collection of YTcollections)
         if(collection.ID === flag.ID)
             selectSubGroup += "<option>" + collection.subGroup + "</option>"
        selectSubGroup += "</select>"

        s += "<table style='display:inline-table;margin:10px;cursor:pointer'><th>"+ flag.name +"</th></tr>"
            + "<tr><td onClick='importVideosFromID(\""+flag.ID+"\")' style='text-align:center'><img src='"+ flag.image +"' style='height:80px' title='"+flag.title+"'></td></tr>"
            + "<tr><td style='text-align:center'>" + selectSubGroup + "</td></tr>"
            + "</table>"
    }

    showPopoverWithContent(s)

}
//--------------------------------------------------
function importVideosFromID(groupID, subGroup)
{
   if(removeVideosWithGoupID(groupID, subGroup))
       return

   for(let collection of YTcollections)
       if(collection.ID === groupID)
           for(let video of collection.list)
             if(!subGroup || collection.subGroup === subGroup)
           {
               const pos = video.indexOf(' ')
               const ytCode = video.slice(0, pos)
               const title = video.slice(pos + 1)
               VideosCut.videosSelected.set(ytCode, {code: ytCode, title: title, groupID: groupID, groupName: collection.group, subGroupName: collection.subGroup})
           }
   updateVideosIn2D()
}
//--------------------------------------------------
function removeVideosWithGoupID(groupID, subGroup)
{
    let codesToRemove = new Set()
    for(let [code, object] of VideosCut.videosSelected)
        if(object.groupID === groupID)
             if(!subGroup || object.subGroupName === subGroup)
                codesToRemove.add(code)
    for(let code of codesToRemove)
       VideosCut.videosSelected.delete(code)
    updateVideosIn2D()

    return codesToRemove.size > 0
}
//--------------------------------------------------
function youtubeURLfromCode(code)
{
  return "https://www.youtube.com/watch?v=" + code
}
//-------------------------------------------------------
function getYoutubeImageURL(url, mini)
{
//https://stackoverflow.com/questions/16222407/url-of-large-image-of-a-youtube-video

if(url.endsWith(".jpg") || url.endsWith(".png"))
  return url
let id = url.indexOf("://") > 0 ? extractYoutubeID(url) : url
if(!id)
  return ""

//return "https://img.youtube.com/vi/" + id + "/"+ (mini ? "1" : "0") + ".jpg"
return "https://img.youtube.com/vi/" + id + "/"+ (mini ? "default" : "0") + ".jpg"
}
//------------------------------------------
function showPopoverWithContent(s, uniqueID, doNotClose)
{
    if(!doNotClose && uniqueID && uniqueID === lastPopoverUniqueID && s === lastPopoverContent)
        return closePopover(uniqueID)

    lastPopoverUniqueID = uniqueID
    lastPopoverContent = s
    const popover = document.getElementById("my-popover")
    popover.innerHTML = s
    popover.showPopover()
}
//------------------------------------------
function closePopover(uniqueID)
{
    if(uniqueID && uniqueID !== lastPopoverUniqueID)
        return
    lastPopoverUniqueID = undefined
    const popover = document.getElementById("my-popover")
    popover.hidePopover()

    return true
}
//----------------------------------------------------
function loggedIn(showMessageIfNotLoggedIn, showMessageIfLoggedIn, showButtonToLoginLogoutInMessage = true)
{
const result = h2 !== ""

if(!result && showMessageIfNotLoggedIn)
	showMessageErrorOnSOSforDuration(TLtranslateFromTo("You must be logged in")
			+ (showButtonToLoginLogoutInMessage ? "&nbsp; <button onClick='pageLogin()'><b>&nbsp;login&nbsp;</b></button>" : ""), 3000)
if(result && showMessageIfLoggedIn)
	showMessageOnSOSforDuration(TLtranslateFromTo("you are already logged in"), 3000)

return result

}
//----------------------------------------------------
function pageLogin()
{

	if(loggedIn())
		return ""

	let s = "<center><br>Login to <i style='color:green'>store</i> configurations<br>and <i style='color:green'>share</i> videos with friends!"
        + "<br><br><table class='td_showOrHideRegisterNewUser' style='width:100%'>"
		+ "<tr><td style='text-align:right'><b>email</b>"
		  + "</td><td><input class='username' type='email' onChange='onChangeTextInputSetAllInputsWithSelector(this, \".username\")' autocomplete='username'" + attributeWithTranslation("placeholder", TLtranslateFromTo("email address"))+" style='width:15em' onKeyUp='return checkForEnter(event, 1)'></td></tr>"
		+ "<tr><td style='text-align:right'><b>"+TLtranslateFromTo("code")
			+ '</td><td><input class="password" type="password" onChange=\'onChangeTextInputSetAllInputsWithSelector(this, \".password\")\' onKeyUp="if(event.keyCode == 13)myLogin()" autocomplete="current-password" '+ attributeWithTranslation("placeholder", TLtranslateFromTo("password")) +' style="width:15em"  onKeyUp="return checkForEnter(event, 2)"></td></tr>'
		+ "</table><table style='width:100%'><tr>"
		+ '<td class="td_showOrHideRegisterNewUser" onClick="registerNewUser()" style="padding:10px;color:blue;cursor:pointer"><a title="create new user" style="font-size:14px">'+TLtranslateFromTo("new user")+'</a></td>'
		+ '<td><button class="save" id="loginButton" onClick="myLogin()" >&nbsp;'+TLtranslateFromTo("login")+'&nbsp;</button></td>'
		+ '<td><button class="lightbackground" id="recoverButton" title="In case you forgot your password" onClick="myRecoverPassword()">&nbsp;'+TLtranslateFromTo("change")+'&nbsp;</button></td>'
		+ "</tr></table>"
        + "<a target='_blank' href='https://umniverse.com' style='text-decoration:none'><p style='display:inline;font-size:70%; width:100%;height:100%'>login powered by &nbsp; </p><img onClick='umniverse()' src='" + cdniverse +"images/umniverse/umniverse_text3.svg' style='cursor:pointer;max-height:1em;vertical-align:text-top' title='powered by Umniverse' alt='logo Umniverse'></a></center>"

	showPopoverWithContent(s, "popover_login")
}
//---------------------------------------
function attributeWithTranslation(attributeName = "title", sTranslated =  "")
{
    return " " + attributeName + "=\"" + sTranslated + "\" "
}
//---------------------------------------
function TLtranslateFromTo(s)
{
    return s
}
//------------------------------------------
function TLtranslate(s)
{
    return s
}
//------------------------------------------
function languageSelectHTML()
{
    return ""
}
//--------------------------
function registerNewUser()
{
	let username = myElementByIdFromMainFrame("username").value
	let password = myElementByIdFromMainFrame("password").value
	let password2 = myElementByIdFromMainFrame("password2").value || password
	let code = myElementByIdFromMainFrame("code").value

  clearHs()
  h1= CREATE_USER
  h5=username
  h6=password
  h7=password2
  h8= lang
  h9= regionIndex

  if(!validateEmail(username))
  {
    $(".username").focus()
    return
  }
  else if(password!=password2)
	  showMessageErrorOnSOSforDuration("The two passwords are not the same", 2000)
  else if(password.length == 0)
  {
	  showMessageErrorOnSOSforDuration("Password can not be empty", 2000)
	  $(".password").focus()
  }
  else if(password.length < 8)
  {
	  showMessageErrorOnSOSforDuration("password must have at least 8 characters", 2000)
	  $(".password").focus()
  }
  else if(grecaptcha === undefined)
			mySubmit(true)
  else
  {

grecaptcha.ready(function() {
	   grecaptcha.execute('6Lc6p5UUAAAAAPmULoYfYAl989udY8S3n0iwQPPL', {action: 'login'}).then(function(token)
	    {		   //Uncaught (in promise) may be because domain is not registered in https://www.google.com/recaptcha/admin/site/345351994

		   /*
			   "success": true|false,      // whether this request was a valid reCAPTCHA token for your site
			   "score": number             // the score for this request (0.0 - 1.0)
			   "action": string            // the action name for this request (important to verify)
			   "challenge_ts": timestamp,  // timestamp of the challenge load (ISO format yyyy-MM-dd'T'HH:mm:ssZZ)
			   "hostname": string,         // the hostname of the site where the reCAPTCHA was solved
			   "error-codes": [...]        // optional
			 */

  messagePopup("Wait, please...","registrationbutton");

  h9=token
  mySubmit(true)
  return true

	  })
})



  }
  return false;
}
//------------------------------------------
function myLogin()
{

  let username =  $(".username").val().trim()
   if(!validateEmail(username))
       {
       $(".username").focus()
       return
       }

   let password =  $(".password").val().trim()


  clearHs()
  h1= LOGIN
  h5= username
  h6= password
  h8= deviceUID()

  if(username.length == 0)
	  {
		showMessageOnSOSforDuration("email can not be empty")
		$(".username").focus()
	  }
  else if(password.length == 0)
	  {
		showMessageOnSOSforDuration("Password can not be empty", 2000)
		$("#password").focus()
	  }
  else
      mySubmit(true)
}
//------------------------------------------
function myRecoverPassword()
{
   const username =  $(".username").val().trim()
   if(!validateEmail(username))
   {
       showMessageOnSOSforDuration("email is not valid")
	   $(".username").focus()
       return
   }

  clearHs()
  h1=RECOVER_PASSWORD
  h5=username
  //h6=showMenu
  mySubmit(true);
}
//----------------------------------------------------------------------------------------
function submit_AIRVIDEOSIWSDK_COMMAND(command, param1, param2, param3, param4, param5, param6)
{
  clearHs()
  h1=AIRVIDEOSIWSDK_COMMAND
  h5=command
  h6=param1
  h7=param2
  h8=param3
  h9=param4
  h10=param5
  h11=param6
  //h6=showMenu
  mySubmit(true);
}
//----------------------------------------------------------------------------------------
function clearHs()
{
h5 = null
h6 = null
h7 = null
h8 = null
h9 = null
h10 = null
h11 = null
//does not clean this unique ID  h12 = "";
}
//------------------------------------------------------------------------------
function validateEmail(str, noErrorMessage)
{
let lastAtPos = str.lastIndexOf('@')
let lastDotPos = str.lastIndexOf('.')
let b = (lastAtPos < lastDotPos && lastAtPos > 0 && str.indexOf('@@') == -1 && lastDotPos > 2 && (str.length - lastDotPos) > 2)
if(!b && !noErrorMessage)
  showMessageErrorOnSOSforDuration("Insert a valid email", 2000)
return b
}
//----------------------------------------------------------------------------
function myElementByIdFromMainFrame(id)
{
  return document.getElementById(id) || $("." + id)[0] || {}
}
//------------------------------------------------------------------------------
function onChangeTextInputSetAllInputsWithSelector(input, selector)
{
	$(selector).val(input.value)
}
//----------------------------------------------------------------------------------
function checkForEnter(e, i)
{


 if(e && e.keyCode == 13)
 {
    switch (i)
    {
    case 1: ById("password").focus(); break;
    case 2: myLogin(); break;
    case 11: ById("password").focus(); break;
    case 12: ById("password2").focus(); break;
    case 20: testAppAPIurl();
	}
  }
}
//------------------------------------------
function mySubmit(async, ha, runIfStoreOffline, url, params, popIndex, callUmniverse)
{
if(ha)
{
ha[2] = h2 //always the same
ha[3] = h3 //always the same
ha[12] = h12 //always the same
}
else
{
ha = []
ha[1] = h1
ha[2] = h2
ha[3] = h3
ha[4] = h4
ha[5] = h5
ha[6] = h6
ha[7] = h7
ha[8] = h8
ha[9] = h9
ha[10] = h10
ha[11] = h11
ha[12] = h12
}

if(isInFrame)
   ha[1] += " isInFrame"
if(returnAsNotManager > 0)
   ha[1] += " asNotManager"
if(returnAsNotLoggedIn > 0)
   ha[1] += " asNotLoggedIn"
if(startedARcamera)
   ha[1] += " startedARcamera"


let param4 = h4

param4 += "LangBL"+languageBeforeLogin + " "

let s = "4 "+param4.length + " " + param4 +msa(1,ha[1])+msa(2,ha[2])+msa(3,ha[3])+msa(5,ha[5])+msa(6,ha[6])+msa(7,ha[7])+msa(8,ha[8])+msa(9,ha[9])+msa(10,ha[10])+msa(11,ha[11])+msa(12,ha[12]);


messagePopup("Aguarde...")

//  document.mf.submit();
let req = new XMLHttpRequest()

req.docurl = url || httpAddress + "/dynamic/dllfunctionasp.dyn"

req.popIndex = popIndex

if(params === undefined)
   params = "&h="+encodeURIComponent(s);//escape(s);

req.async = async

//with this the return has to be XML req.overrideMimeType("text/xml");
//if(req.overrideMimeType)//because of IE10
//  req.overrideMimeType("text/plain");

req.runIfStoreOffline = runIfStoreOffline

req.ontimeout = function(e){showMessageErrorOnSOSforDuration("SERVER REQUEST TIMEOUT")}


//req.addEventListener('load', loadXMLhttpRequest)
req.onload = function(event)
		{
		loadXMLhttpRequest(event, ha, req)
		}
req.onerror = function(event)
		{
		consoleLogIfIsInLocalhost("ERROR: mySubmit req.onerror")
		}

req.addEventListener('readystatechange', onreadystatechangeXMLhttpRequest)

req.params = params
sendRequest(req)

}
//--------------------------
function sendRequest(req)
{

req.open("POST", req.docurl, req.async);

req.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=utf-8");
//req.setRequestHeader("Accept-Charset", "utf-8");
//chrome thinks this is unsafe   req.setRequestHeader("Content-length", params.length);
try
	{
	req.send(req.params);
	}
catch(e)
    {
     trataFalhaGuardandoLocalmente(req);
    }

}
//----------------------------------------------------------------------
function onreadystatechangeXMLhttpRequest()
{
	/*this.readyState
	0	UNSENT	Client has been created. open() not called yet.
	1	OPENED	open() has been called.
	2	HEADERS_RECEIVED	send() has been called, and headers and status are available.
	3	LOADING	Downloading; responseText holds partial data.
	4	DONE	The operation is complete.
	*/
  if (this.readyState==4)
  {
     if ((this.status >= 200 && this.status <= 300)||this.status == 304)
     {
       //SUCCESS dealt above in onload = function(e)
     }
     else
     {
         messagePopup()
        showMessageErrorOnSOSforDuration("host is not available");
     }

  }
}
//----------------------------------------------------------------------
function loadXMLhttpRequest(event, ha, req)
{
	  if(req.nextSubmitDownloadThisFileName)
	    	saveOrOpenBlob(req.response, req.nextSubmitDownloadThisFileName)

        if(req.popIndex !== undefined)
          {
             apagarDeLocalStorage(req.popIndex)
             enviarDeOfflineParaServidor()
          }

    	let rri = new RequestResponseInfo()

    	let refresh = isString(ha[1]) && Primiti.betweenChars(ha[1], ' ', 1, 2) === "refresh"

		rri.comesFromMySubmit = true
    	rri.comesFromMySubmitRefresh = refresh  //must check against true or false for it can be undefined
		if(refresh)//stay where they are
			rri.doNotAddTo_orderedSetOfOpenedDIVSin2D = true

    	rri.column_where_main_div_stays_DIV_CLICKED = req.column_where_main_div_stays_DIV_CLICKED

        messagePopup()

        let answer = extractDataFromServer(rri, req.response)
	    if(answer == "REPEAT")
	       sendRequest(event)
	    else
	      {
	  	   // this.removeEventListener('load',loadXMLhttpRequest)
	  	    req.removeEventListener('load', onreadystatechangeXMLhttpRequest)

	    	for (let s in req)
	    	  delete req[s]
	    //Only properties can be deleted   delete this
	      }
}
//------------------------------------------
function msa(n,h)
{
if(h==null)
  return ""
if(h.length)
  	h = replaceCharsToSubmit(h)
  else
    h = ""+h
return n+" "+h.length+" "+h
}
//-------------------------------------------
function extractDataFromServer(rri = {}, s, pushFromServer)
{
	//STRANGE extractDataFromServerREALLY is in thsi same file. May be useful for other functions...
let returnFromCacheDivOnServer = false //to ignore some commands that should not be included in a CACHE such as MANDATORY_LOGOUT

const END_OF_COMMAND = "@ -&| ? @";

const SHOW_MESSAGE = 2
    , SHOW_MESSAGE_ON_SOS = 3
    , LOGIN_FAILED = 4
    , USER_CREATE_SUCCESS = 6
    , LOGIN_SUCCESSFUL = 5
    , EVAL_JSCODE = 95

let returnValue = "OK"

let typesInDefault = ""
let alreadyRefreshDIVSstartingEndingHaving = {}
let lastTypeDiv
let showMessageOnSOSall = "";
let showMessageOnSOStotalTime = 0
let object3d
let divName

let myCssToUpdateAtEnd = []

enteredExtractDataFromServer = true

let pos // used later
let pos2
let pos3

if(globalElementToHide)
	$(globalElementToHide).css("display", "none")

let object = null
let animation = 0
let lastPos = 0
let numChars
let commands = new Set()

let key
let type

try {
    while (s.length > lastPos + 3) //any command takes 3 spaces or more
    {
        pos = s.indexOf(" ", lastPos)
        if (pos == -1)
            break
        let objectW = parseInt(s.slice(lastPos, pos))
        let sObject
        if (objectW == -1) {
            const p = s.indexOf(END_OF_COMMAND, pos)
            sObject = s.slice(pos + 1, p)
            lastPos = p + END_OF_COMMAND.length
        } else {
            sObject = s.slice(pos + 1, pos + 1 + objectW)
            lastPos = pos + 1 + objectW
        }

        pos = sObject.indexOf(" ")
        if (pos == -1)
            break
        let objectIDS = sObject.slice(0, pos)
        sObject = sObject.slice(pos + 1)

        pos = sObject.indexOf(" ")
        if (pos == -1)
            pos = sObject.length
        type = parseInt(sObject.slice(0, pos))
        sObject = sObject.slice(pos + 1)

        let lastPos2
        let numberW

//pre-round
        switch (type) {
            default:
                let command = {}
                command.objectIDS = objectIDS
                command.sObject = sObject
                command.type = type
                commands.add(command) //if not dealt in this round will be treated in next
                command = null
        } //switch

    }//while

}
catch (e)
{
}

let numberW
let data
let tableAttrName

for(let command of commands)
{
    let objectIDS = command.objectIDS
    let sObject = command.sObject
    type = command.type

//MAIN round
    switch (type) //if CRASHES on breakpoint debug then put break in a line before! (tried setTimeout() with no success)
    {
        case SHOW_MESSAGE:
            alert(sObject)
            break
        case SHOW_MESSAGE_ON_SOS:
           showMessageOnSOSall += (showMessageOnSOSall ? "<br>" : "") + TLtranslate(sObject)
           showMessageOnSOStotalTime += parseInt(objectIDS)
           break
       case LOGIN_FAILED:
           showMessageErrorOnSOSforDuration(sObject, 2000)
           break
       case LOGIN_SUCCESSFUL:
              closePopover("popover_login")

              $(".hideWhenLogin").hide()
              $(".showWhenLogin").show()

              if(loginClientID)//avoid new login from a serious error (cached pages?)
                break
              //navigator.sendBeacon('/analytics', JSON.stringify({ event: 'page_leave' }));

              confirmBeforeUnload = true


             pos = sObject.indexOf(" ")
             nomeUtilizador = sObject.slice(0,pos)
             sObject = sObject.slice(pos+1)
             pos = sObject.indexOf(" ")
             userID = sObject.slice(0, pos)

             sObject = sObject.slice(pos+1)
             pos = sObject.indexOf(" ")
             /*idsOfLogin = */ sObject.slice(0, pos) //UNDER CONSTRUCTION!!!
             sObject = sObject.slice(pos+1)
             pos = sObject.indexOf(" ")
             cloudStorageLocation = parseInt(sObject.slice(0, pos))
             sObject = sObject.slice(pos+1)
             pos = sObject.indexOf(" ")
             numberW = parseInt(sObject.slice(0, pos))
             sObject = sObject.slice(pos+1)
             cloudStorageLocationName = sObject.slice(0, numberW)
             sObject = sObject.slice(numberW)

             loginClientID = objectIDS

             rri.doNotCheckComesFromMySubmit = true

             h2 = userID
             //h12 also defined in tapalife_start
             h12 = PROGRAM_VERSION + " " + versionOnMyCompiler + " " + origServletInfo + " " + deviceUID()+" "+uniqueSessionUID + " " + loginClientID


             $(".html_username_afterlogin").html(nomeUtilizador)

             showMessageOnSOSall += (showMessageOnSOSall ? "<br>" : "") + "<b style='color:green'>Welcome to AirVideos Umniverse</b>"
            break

       case USER_CREATE_SUCCESS:
           showMessageErrorOnSOSforDuration(sObject, 5000)
           break
        case EVAL_JSCODE:
            myEval(sObject)
            break
        default: consoleLogIfIsInLocalhost("TYPE IN EXTRACTDATA: " + type)
    }
}//for

    if(showMessageOnSOSall)
      showMessageOnSOSforDuration(showMessageOnSOSall, showMessageOnSOStotalTime)

}
//------------------------------------------
function replaceCharsToSubmit(h)
{
	h = "" + h; //to be a string
    h = h.replace(/\r\n/g,"#CrlF&");
    // destroys JSON keys in DialogFlow h = h.replace(/\n/g,"#CrlF&");
    h = h.replace(/\r/g,"#CrlF&");
    return h;
}
//------------------------------------------
function messagePopup(message)
{
    $(".popups").css("display", message ? showKeyword : "none");
}
//--------------------------------------------------
function consoleLogIfIsInLocalhost(text)
{
	if(isInLocalhost)
	  console.log("LOCAL> " + text)
}
//-------------------------------
function isString(s)
{
return typeof s === "string"
}
//-----------------------------------------------------------------
class RequestResponseInfo
{
	constructor()
	{

	}
}
//---------------------------------------------
function deviceUID()
{
  if(!deviceUniqueID)
  {
  deviceUniqueID = window.localStorage.getItem("deviceUID")
  if(!deviceUniqueID)
     {
	  deviceUniqueID = crypto.randomUUID()
      window.localStorage.setItem("deviceUID", deviceUniqueID)
     } 
  }
  return deviceUniqueID
}
//------------------------------------------
function AirVideos_receiveDataFromUmniverse(s)
{
s = decodeURIComponent(s)

let pos = s.indexOf(' ')
AIRVIDEOSIWSDK_COMMAND = s.slice(0, pos)
let lastPos = pos + 1

pos = s.indexOf(' ', lastPos)
const numBaseAps = parseInt(s.slice(lastPos, pos))
lastPos = pos + 1
for(let i = 0; i < numBaseAps; i++)
{
    pos = s.indexOf(" ", lastPos)
    const baID = s.slice(lastPos, pos)
    lastPos = pos + 1
    pos = s.indexOf(" ", lastPos)
    let numChars = parseInt(s.slice(lastPos, pos))
    lastPos = pos + 1 + numChars
    const appInfo = JSON.parse(s.slice(pos + 1, lastPos))

    pos = s.indexOf(" ", lastPos)
    numChars = parseInt(s.slice(lastPos, pos))
    lastPos = pos + 1 + numChars
    const data = s.slice(pos + 1, lastPos)

    let baseApp = new BaseApp(baID, data)
    baseApp.appInfo = appInfo
}

if(numBaseAps > 0 || VideosCut.videosSelected.size > 0)
{
    if(loggedIn())
        manageCloudObjects(true)
    else
    {
       for(let [baID, baseApp] of mapBaseAppID_to_AirVideo)
         for(let [code, video] of baseApp.object.videos)
         {
             video.isFromCloud = true
             VideosCut.videosSelected.set(code, video)
         }
        updateVideosIn2D()
    }
}

}
//------------------------------------------
function uploadLocalVideosToCloud()
{
    const groupName = $("#airvideos_groupName_to_upload").val().trim();
    if(!groupName)
    {
        showMessageErrorOnSOSforDuration("must have a group name")
        $("#airvideos_groupName_to_upload").focus()
        return
    }

    const airVideosBaseApp = {
        groupName: groupName,
        videos: JSON.stringify(Array.from(VideosCut.videosSelected.entries())),
        planesPersistentInfo: JSON.stringify(Array.from(mapWallTableIDtoPersistentInfo.entries()))
        }   

    uploadedAirVideosBaseApp = {
        groupName: groupName,
        videos: VideosCut.videosSelected,
        planesPersistentInfo: mapWallTableIDtoPersistentInfo,
    }

    const baseAppID = ""

    submit_AIRVIDEOSIWSDK_COMMAND("UPLOAD", baseAppID, JSON.stringify(airVideosBaseApp))
    
}
//------------------------------------------
function refresh_manageCloudObjects()
{
    if(closePopover("manageCloudObjects"))
        manageCloudObjects()
}
//------------------------------------------
function deleteCloudBaseApp(baseAppID)
{
    if(confirm("Delete object forever?"))
        submit_AIRVIDEOSIWSDK_COMMAND("DELETE", baseAppID)
}
//------------------------------------------
function showBaseappIDvideosAndPlanes(baseAppID)
{
   const ba = mapBaseAppID_to_AirVideo.get(baseAppID)

   VideosCut.videosSelected = ba.object.videos
   MyPlane.loadPlanesPersistentInfo(ba.object.planesPersistentInfo)

   updateVideosIn2D()

}
//------------------------------------------
function makeBaseappIDpublic(baseAppID, publicNOTprivate)
{
    submit_AIRVIDEOSIWSDK_COMMAND("MAKE_PUBLIC", baseAppID, publicNOTprivate)
}
//------------------------------------------
function AirVideos_commandFromServer(command, p1)
{
    switch(command)
    {
        case "UPLOADED":
            new BaseApp(p1, uploadedAirVideosBaseApp)
            break
        case "DELETED":
            mapBaseAppID_to_AirVideo.delete(p1)
            break
    }
    refresh_manageCloudObjects()
}
//------------------------------------------
function manageCloudObjects(doNotClose)
{
   	if(!loggedIn())
		return

    let s = "<table style='width:100%'><tr><th>Local videos =  <b style='color:red'>" + VideosCut.videosSelected.size + "</b></th><th>Cloud objects = <b style='color:green'>" + mapBaseAppID_to_AirVideo.size + "</b></th></tr></table>"

    if(VideosCut.videosSelected.size > 0)
        s += "<br>Upload local videos to cloud<br><input id='airvideos_groupName_to_upload' style='width:150px' placeHolder='Group Name'><button onClick='uploadLocalVideosToCloud()'>upload</button>";

    if(mapBaseAppID_to_AirVideo.size)
    {
        s += "<br><br><table border=1><th>Group Name</th><th>videos</th><th>public</th><th>delete</th></tr>"
        for(let [baID, baseApp] of mapBaseAppID_to_AirVideo)
        {
            s += "<tr><td onClick='showBaseappIDvideosAndPlanes(\""+ baID +"\")' style='cursor:pointer;color:blue'>" + baseApp.object.groupName + "</td><td>" + baseApp.object.videos.size + "</td>"
                + "<td>&nbsp;<input onClick='makeBaseappIDpublic(\""+ baID +"\", this.checked)' type='checkbox' "+ (baseApp.appInfo.public ? "checked" : "")+" title='make the link public or private'> &nbsp;<a target='_blank' href='" + httpLinkAddressWithParameters + "baseappid="+ baID +"'>link</a>&nbsp;</td>"
                + "<td><b onClick='deleteCloudBaseApp(\""+ baID +"\")' style='color:red;cursor:pointer'>&nbsp;X&nbsp;</td></tr>"
                + "</tr>"
        }
        s += "</table>"
    }

    showPopoverWithContent("<center>" + s + "</center>", "manageCloudObjects", doNotClose)
}
//------------------------------------
function myEval(sObject, doNotShowError)
{
if(!sObject)
	return false
	//see https://en.wikipedia.org/wiki/Nested_quotation for the logic is    "   \"   \\\"  \\\"   \"   "
	//good example at: showNotHideSetText() of Java Class ScreensMasterSlave
try
{
sObject = sObject.replaceAll("&#37;","%")
eval(sObject)
}
catch(e)
{
	 sObject = sObject.replaceAll("\\\"",'"')
	 try
	 {
	 eval(sObject)
	 }
	 catch(e)
	 {
		 sObject = sObject.replaceAll("\\\'","'")
		 try
		 {
		 eval(sObject)
		 }
		 catch(e)
		 {
			 sObject = sObject.replace(/\"/g,"&#34;")
			 try
			 {
			 eval(sObject)
			 }
			 catch(e)
			 {
			 if(!doNotShowError)
			    colorTrace(e.stack, "red")
			 return false
			 }
		 }
	 }
}
return true
}
//------------------------------------------
//------------------------------------------
class Primiti
    {
	static betweenChars(s, ch, firstNum = 1, lastNum = 2)
	{
		if(!s || firstNum >= lastNum)
			return ""

		let lastPos = 0
		while(true)
		{
			const pos = s.indexOf(ch, lastPos)
			if(pos === -1)
				return ""
			lastPos = pos + 1
			firstNum--
			lastNum--

			if(firstNum === 0)
				while(true)
				{
					let lastPos2 = pos + 1
					const pos2 = s.indexOf(ch, lastPos2)
					if(pos === -1)
						return ""
					lastNum--
					if(pos2 === -1)
						return s.slice(lastPos)
					if(lastNum === 0)
						return s.slice(lastPos, pos2)
					lastPos2 = pos + 1
					lastNum--
				}

		}

		return ""

	}
}//class Primiti
//--------------------------------------------
class BaseApp
{
   constructor(baID, dataORobject)
   {
       const ba = this
       if(isString(dataORobject))
       {
       ba.object = JSON.parse(dataORobject)
       ba.object.videos = new Map(JSON.parse(ba.object.videos))
       ba.object.planesPersistentInfo = ba.object.planesPersistentInfo
                                        ? new Map(JSON.parse(ba.object.planesPersistentInfo))
                                        : new Map()
       if(INITIAL_baseAppID) //first time
            {
                INITIAL_baseAppID = undefined
                MyPlane.loadPlanesPersistentInfo(ba.object.planesPersistentInfo)
            }
       }
       else ba.object = dataORobject

       ba.appInfo = ba.appInfo || {public: false}
       mapBaseAppID_to_AirVideo.set(baID, ba)
   }

}//class BaseApp
//-------------------------------------------
function showInstructions()
{
    let s = "<center><br><b>Instructions in XR</b>"
        + "<br><br><i style='color:red'>Click on the videos:</i>"
        + "<br>one click - selects the video"
        + "<br>second click - selects the group"
        + "<br>third click - unselects the group"
        + "<br>click in another selected - selects/unselects "
        + "<br><br><i style='color:red'>Click on the walls or tables:</i>"
        + "<br>no video selected - free videos are joined"
        + "<br>other videos selected - joins those videos"
        + "<br>owned videos selected - rearranges those videos"
        + "<br>tables no videos selected - rearranges videos"
        + "<br>walls no videos selected - switches area"
        + "<br><br><i style='color:red'>Click on Meta's robot:</i>"
        + "<br>to show or hide walls and tables"
        + "<br><br>ENJOY AND SHARE YOUR VIDEOS"
        + "<br><br><b style='vertcial-align:middle'>Enter XR clicking on </b>"
        + '<img onclick="world.launchXR()" src="https://storage.googleapis.com/cdniverse/images/WebXR/webxr.png" style="height:34px;vertical-align:middle;cursor:pointer"/>'
        + "<br>&nbsp;</center>"

    showPopoverWithContent(s, "showInstructions")
}
//-------------------------------------------
function showOrHideWallsTables(showNOThide)
{
if(showNOThide === undefined)
    showNOThide = !showingWallsAndTable
showingWallsAndTable = showNOThide
for(let [id, entity] of mapEntityIDtoMyPlane)
    entity.object3D.visible = showingWallsAndTable

}
//-------------------------------------------
function ById(id)
{
    return document.getElementById(id) || $("."+id)[0]
}

