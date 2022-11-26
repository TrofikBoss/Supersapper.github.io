let game = document.querySelector("#game");
let tools = document.querySelector(".tools");
let map = [];
let minelocate = [];
let gameover = false;
console.log("supersapper made by TitanExpert");

function GenArea(map, maxx, maxy, propmine) {
  winner = false;
  minelocate = [];
  for (y in map) {
    map[y] = "";
  }
  if (document.body.clientWidth < 550) {
    game.style.width = `${maxx * (document.body.clientWidth / maxx)}px`;
    game.style.height = `${maxy * (document.body.clientWidth / maxy) + 110}px`;
  } else {
    game.style.width = `${maxx * 61 + 214}px`;
    game.style.height = `${maxy * 61 + 110}px`;
  }
  tools.style.top = `${maxy * 61 + 10}px`;
  let random;
  let gencount = 0
  for (let y = 0; y < maxy; y++) {
    let raw = "";
    for (let x = 0; x < maxx; x++) {
      random = Math.random() * 100;
      randomNullGenX = Math.random();
      if (propmine > random) {
        minelocate[gencount] = {"x": x, "y": y};
        raw += "m";
      } else {
        raw += "a";
      }
      gencount += 1;
    } 
    map[y] = raw;
  }
  DrawArea(map);
}
function DrawArea(map) {
  document.querySelectorAll(".area").forEach(function(deletearea) {
    deletearea.outerHTML = "";
  })
  let nullarea = false;
  for (let y in map) {
    for (let x in map[y]) {
      let area = document.createElement("div");
      area.classList.add("area");
      area.classList.add(`coord-x-${x}`);
      area.classList.add(`coord-y-${y}`);
      if (document.body.clientWidth < 550) {
        area.style.left = `${x * (document.body.clientWidth / map[1].length - 4)}px`;
        area.style.top = `${y * (document.body.clientWidth / map[1].length - 4)}px`;'
        area.style.width = `${document.body.clientWidth / map[1].length}px`; 
        area.style.height = `${document.body.clientWidth / map[1].length}px`; 
      } else {
        area.style.left = `${x * 61 + 100}px`;
        area.style.top = `${y * 61}px`;
      }
      if (map[y][x] == "m") {
        area.classList.add("area-mine");
        area.classList.add("area-close");
      }
      if (map[y][x] == "a" || map[y][x] == "n") { 
        let minecount = 0;
        for (let z in minelocate) {
          if (Math.abs(minelocate[z].x - x) <= 1) {
            if (Math.abs(minelocate[z].y - y) <= 1) {
              minecount += 1;
            }
          }
        }
        if (minecount > 0) {
          area.classList.add(`around-${minecount}`);
          area.innerHTML += `<p>${minecount}</p>`;
        }
        area.classList.add("area-close");
        if ((minecount == 0 && nullarea == false) && ((map.length / 2 - 3 < y) && (map.length / 2 + 3 > y))) {
          area.classList.add("area-open");
          area.classList.remove("area-close");
          nullarea = true;
        } 
      }
      
      game.append(area);
    }
  }
}
function GameOver() {
  gameover = true;
  document.querySelectorAll(".area-mine").forEach(function(mineopen) {
    mineopen.classList.remove("area-close");
    mineopen.classList.add("area-open");
  })
  audio.pause();
  var audiogameover = new Audio();
  audiogameover.src = "audio/GameOver.mp3";
  audiogameover.play();
}

var audio = new Audio();
audio.src = "audio/FirstExpert\ -\ TitanExpert.mp3";
let menuacts = null;

function menuAction(act, butx) {
  if (butx.classList.contains("active") == false) {
    butx.classList.add("active");
    menuacts = act;
  } else {
    butx.classList.remove("active");
    menuacts = null;
    document.querySelectorAll(".tools button").forEach(function(but) {
      but.classList.remove("active");
    })
  }
  if (menuacts == "reset") {
    butx.classList.add("active");
    GenArea(map, 10, 10, 20);
    gameover = false;
    menuacts = null;
    audio.play();
    AreaChecker();
    setTimeout(() => {butx.classList.remove("active")}, 1000);
  }
}
function AreaChecker() { // запускает проверку на клики, когда перезапускаешь карту, клетки создаются заново и нужна новая проверка
  document.querySelectorAll(".area").forEach(function(areaop) {
    areaop.addEventListener('click', function(polecl) {
      if (gameover == false && menuacts != "flag" && areaop.classList.contains("flag") == false) {
        areaop.classList.remove("area-close");
        areaop.classList.add('area-open');
        if (areaop.classList.contains("area-mine")) {
          GameOver();
        }
      }
      if (menuacts == "flag" && gameover == false && areaop.classList.contains("area-close") == true) {
        areaop.classList.toggle('flag');
      }
    })
  })
}
function wingames() {
  var audiowin = new Audio();
  audiowin.src = "audio/Winner.mp3";
  audiowin.play();
  audio.pause();
  document.querySelectorAll(".area").forEach(function(win) {
    win.classList.add("win-theme");
  })
}
let closecount = 0;
let wingame = false;
function tick() {
  document.addEventListener('click', function() {
    if(Math.round(audio.currentTime) == 0) {
      audio.play();
    }
  })
  if (Math.round(audio.currentTime) == Math.round(audio.duration) && gameover == false) {
    audio.play();
  }
  document.querySelectorAll(".area-close:not(.area-mine)").forEach(function(checkarea) {
    closecount += 1;
  })
  if (closecount == 0 && wingame == false) {
    wingame = true;
    wingames();
  }
  closecount = 0;
}

GenArea(map, 10, 10, 20);
setInterval(tick, 100);
AreaChecker();



