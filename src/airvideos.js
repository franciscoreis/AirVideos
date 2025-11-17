"use strict"

var myPlaneDetection

var timeout_showMessageErrorOnSOSforDuration

const VideosCut = {
  videosSelected: new Map()
}

const cdniverse = "https://storage.googleapis.com/cdniverse/";

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

//-----------------------------------------------------------------
function  initialize_airvideos()
{
const codes = window.localStorage.getItem("codes")

  if(codes) {
    let lastPos = 0
    while (lastPos < codes.length) {
      let pos = codes.indexOf(" ", lastPos)
      const code = codes.slice(lastPos, pos)
      lastPos = pos + 1
      pos = codes.indexOf(" ", lastPos)
      const numChars = parseInt(codes.slice(lastPos, pos))
      lastPos = pos + 1 + numChars
      const object = JSON.parse(codes.slice(pos + 1, lastPos))
      VideosCut.videosSelected.set(code, object)
    }
    updateVideosIn2D()
  }

}
//-----------------------------------------------------------------
function showMessageErrorOnSOSforDuration(message, durationMS = 3000, color = "red")
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
        $("#inputToReceiveYoutubeURLorCode").html("")
        VideosCut.videosSelected.set(ytCode, {})
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
for(let [code, object] of VideosCut.videosSelected)
{
    const objectStr = JSON.stringify(object)
    codes += code + " " + objectStr.length + " " + objectStr

    const group = object.groupName + " - " + object.subGroupName
    let ID_toS = groupNameToS.get(group)
    if(!ID_toS)
        ID_toS = {toS: "", groupID: object.groupID, groupName: object.groupName, subGroupName: object.subGroupName}
    ID_toS.toS += "<table class='wm' style='display:inline-table;border:2px solid #red;margin:5px'><tr><th>"
          + "<table class='wm' style='width:100%'><td class='wm' style='width:1px;cursor:pointer' title='XR AirVideos!'><img onClick='world.launchXR()' src='https://storage.googleapis.com/cdniverse/images/WebXR/webxr.png' style='height:24px'></td>"
          + "<td class='wm text_ellipsis' style='max-width:150px'>" + (object.title || code) + "</td>"
          + "<td class='wm' onClick='removeYouTubeCode(\""+ code +"\")' style='cursor:pointer;color:red;width:1px'><b>&nbsp;X&nbsp;</b></td></tr></table>"
          + "</th></tr>"
        + "<tr><td><a target='_blank' href='"+youtubeURLfromCode(code)+"'><img src='"+getYoutubeImageURL(code)+"' style='width:200px;aspect-ratio:200/150'></a></td></tr>"
        + "</table>"
    groupNameToS.set(group, ID_toS)
}

for(let [group, ID_toS] of groupNameToS)
   s += (ID_toS.groupID ? "<b style='font-size:120%;color:green'>" + group + " <font onClick='removeVideosWithGoupID(\""+ID_toS.groupID+"\", \""+ID_toS.subGroupName+"\")' style='cursor:pointer;color:red'>X</font></b><br>" : "")
        + ID_toS.toS + "<br>"

window.localStorage.setItem("codes", codes);

$("#show_videos_in_2D").html(s)
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
               VideosCut.videosSelected.set(ytCode, {title: title, groupID: groupID, groupName: collection.group, subGroupName: collection.subGroup})
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
function showPopoverWithContent(s)
{
    const popover = document.getElementById("my-popover")
    popover.innerHTML = s
    popover.showPopover()
}
//------------------------------------------
function closePopover(s)
{
    const popover = document.getElementById("my-popover")
    popover.showPopover()
}
//------------------------------------------

