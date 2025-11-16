"use strict"

var myPlaneDetection

var timeout_showMessageErrorOnSOSforDuration

const VideosCut = {
  videosSelected: new Map()
}

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
function showMessageErrorOnSOSforDuration(message, durationMS = 3000)
{
$("#top_message_duration").html(message);
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
        return showMessageErrorOnSOSforDuration("paste url or code of video", 2000)
    let ytCode = code.indexOf("/") == -1 ? code : extractYoutubeID(code)
    if(!ytCode)
        return showMessageErrorOnSOSforDuration("not a valid video", 2000)
    else if(VideosCut.videosSelected.get(ytCode))
        return showMessageErrorOnSOSforDuration("video already present", 2000)
    else validYoutubeVideoId(ytCode).then((success) =>
      {
        VideosCut.videosSelected.set(ytCode, {})
        updateVideosIn2D()
      })
}
//----------------------------------------
function updateVideosIn2D()
{
let s = ""
let codes = ""
for(let [code, object] of VideosCut.videosSelected)
{
    const objectStr = JSON.stringify(object)
    codes += code + " " + objectStr.length + " " + objectStr
    s += "<table style='display:inline-table;border:2px solid #red;margin:5px'><tr><th>" + code + "</th></tr>"
        + "<tr><td><a target='_blank' href='"+youtubeURLfromCode(code)+"'><img src='"+getYoutubeImageURL(code)+"' style='width:200px;aspect-ratio:200/150'></a></td></tr>"
        + "</table>"
}
window.localStorage.setItem("codes", codes);

$("#show_videos_in_2D").html(s)
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

