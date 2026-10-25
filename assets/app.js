// StarBase gallery + Adsterra Direct Link click flow
// Flow: visitor clicks a photo/video -> Direct Link ad opens in a new tab FIRST -> the photo/video then opens here.
(function(){
  // Direct Link rotation: every click opens one of the configured links, picked at random.
  var LINKS = (window.GF_DIRECT_LINKS && window.GF_DIRECT_LINKS.length ? window.GF_DIRECT_LINKS : (window.GF_DIRECT_LINK ? [window.GF_DIRECT_LINK] : []));
  function fireAd(){
    if(LINKS.length){ try{ window.open(LINKS[Math.floor(Math.random()*LINKS.length)], "_blank"); }catch(e){} }
  }
  // Tabs (Photos / Videos)
  var tabs=document.querySelectorAll(".tab");
  tabs.forEach(function(t){
    t.addEventListener("click",function(){
      tabs.forEach(function(x){x.classList.remove("active")});
      t.classList.add("active");
      document.querySelectorAll("[data-pane]").forEach(function(p){
        p.style.display = (p.getAttribute("data-pane")===t.getAttribute("data-tab")) ? "" : "none";
      });
    });
  });
  // Lightbox
  var lb=document.getElementById("lightbox"), lbImg=document.getElementById("lb-img"),
      lbVid=document.getElementById("lb-vid"), items=[], idx=0;
  // Video ad overlay: a transparent layer over the video that re-arms every 6s.
  // Armed + user clicks anywhere on the video (pause, play, seek) -> Direct Link opens,
  // layer hides for 6s (video controls work normally), then it re-arms. Video only, never photos.
  var AD_REARM_MS=10000, adTimer=null, adArmed=false, adLayer=document.getElementById("lb-ad");
  function adDisarm(){ adArmed=false; if(adLayer) adLayer.style.display="none"; if(adTimer){ clearTimeout(adTimer); adTimer=null; } }
  function adArm(){ adArmed=true; if(adLayer) adLayer.style.display=""; }
  function adSchedule(){ adDisarm(); adTimer=setTimeout(adArm, AD_REARM_MS); }
  if(adLayer){ adLayer.addEventListener("click", function(){ if(!adArmed) return; fireAd(); adSchedule(); }); }
  function collect(){ items=Array.prototype.slice.call(document.querySelectorAll(".pitem")); }
  function show(i){
    if(!items.length) return;
    idx=(i+items.length)%items.length;
    var el=items[idx], type=el.getAttribute("data-type"), src=el.getAttribute("data-full");
    if(type==="video"){ lbImg.style.display="none"; lbVid.style.display=""; lbVid.src=src; lbVid.play&&lbVid.play(); adSchedule(); }
    else { lbVid.pause&&lbVid.pause(); lbVid.style.display="none"; lbImg.style.display=""; lbImg.src=src; adDisarm(); }
    lb.classList.add("open");
  }
  document.addEventListener("click",function(e){
    var it=e.target.closest?e.target.closest(".pitem"):null;
    if(it){ collect(); fireAd(); show(items.indexOf(it)); }
  });
  var close=document.getElementById("lb-close"), prev=document.getElementById("lb-prev"), next=document.getElementById("lb-next");
  function hide(){ lb.classList.remove("open"); adDisarm(); if(lbVid){lbVid.pause&&lbVid.pause(); lbVid.removeAttribute("src"); lbVid.load&&lbVid.load();} }
  close&&close.addEventListener("click",hide);
  prev&&prev.addEventListener("click",function(){ fireAd(); show(idx-1); });
  next&&next.addEventListener("click",function(){ fireAd(); show(idx+1); });
  document.addEventListener("keydown",function(e){ if(e.key==="Escape") hide(); });
})();
