'use strict';

const btnsContainer = document.querySelector(".btns-container");
const basebtns = [...document.querySelectorAll(".btn-base")];
const selectInnings = document.querySelector(".select-innings");
const inningsNum = document.querySelector(".innings-num");
const showScores = document.querySelectorAll(".score");
const arrowImg = document.querySelector(".img-arrow");
const arrowBtn = document.querySelector(".arrow-btn");
const teamBtnImgs = document.querySelectorAll(".team-btn-img");
const reelLine = document.querySelector(".reel-line");
const imgsContainer = document.querySelectorAll(".imgs-container");
const wrappers = document.querySelectorAll(".wrapper");

const items = ["diamond", "bat", "hotdog", "peanuts", "wildcard", "flammingbaseball"]

const itemPoints = {
    diamond: 100,
    wildcard: 50,
}

let audioObj = {
    onediamond: new Audio("./music/one diamond.mp3"),
    twodiamond: new Audio("./music/two diamonds.mp3"),
    threediamond: new Audio("./music/three diamonds.mp3"),
    wildcard: new Audio("./music/wild card.mp3"),
    touchBase: new Audio("./music/touch base.mp3"),
    diamondAppear: new Audio("./music/diamond appear.mp3"),
    home: new Audio("./music/home.mp3"),
    away: new Audio("./music/away.mp3")
}

let btnclicked = [];

let awayScore = 0;
let homeScore = 0;

let point = 0;

let spinCount = 0;

let arrowClicked = 0;

let scores = [];

let currInnings = 1;

imgsContainer.forEach(function(container, indx) {
    let randNum = Math.floor(Math.random() * 72) + 4;
    let propName = '--top-pos-' + (indx+1);
    let bottomPropName = '--bottom-pos-' + (indx+1);
    document.documentElement.style.setProperty(propName, "-"+randNum+"vw")
    document.documentElement.style.setProperty(bottomPropName, "-" +(randNum+72)+"vw")
})


const PlaySound = function (name) {
    let audio = new Audio("./music/" + name + ".mp3")
    audio.loop = false;
    return audio;
}

const calculatePoints = function(arr) {
    let points = 0;

    arr.forEach(function(item) {
        if(!itemPoints[item]) return;
        points += itemPoints[item]
    })
    
    if(points == 150) {points = 200; return points;}
    if(points == 250) {points = points * 2; return points;}

    if(points === 200) {points += 50; return points;}
    if(points === 300) {points = 2500; return points;}

    return points;
}

const resetBase = function() {
    basebtns.forEach(function(btn, indx) {
        if(!btn.classList.contains("btn-base-1")) btn.disabled = true;
        btn.querySelector("img").src = indx != 3 ? "images/base off brown background.png" : "images/spin off.png"
    })
}

const sfxScore = function(rolleditems) {
    let diamond = 0;
    let wildcard = 0
    rolleditems.forEach(function(item) {
        if(item === "diamond") diamond++;
        if(item === "wildcard") wildcard++;
    })
    if(diamond === 3) audioObj.threediamond.play();
    if(diamond === 2) audioObj.twodiamond.play();
    if(diamond === 1) audioObj.onediamond.play();
    point = calculatePoints(rolleditems);
    resetBase();

    if(arrowClicked % 2 === 0) {
        awayScore += point;
        showScores[0].innerHTML = awayScore;
    } else {
        homeScore += point;
        showScores[1].innerHTML = homeScore;
    }
    if(currInnings != Number(inningsNum.innerHTML)) {
        showScores[1].innerHTML = homeScore;
        showScores[0].innerHTML = awayScore;

        inningsNum.innerHTML = currInnings;
    }
} 

btnsContainer.addEventListener("click", function(e) {
    if(e.target.classList.contains("btn-base")) {
        spinCount = 0;
        let nextNo = e.target.classList[0].split("-")[2];
        let img = e.target.querySelector("img"); 

        if(nextNo <= 3) {
            if(!img.src.includes("on")) {
               let touchBase = PlaySound("touch base");
               touchBase.addEventListener("canplaythrough", function() {                
                    let nextButton = document.querySelector(`.btn-base-${Number(nextNo) + 1}`)
                    nextButton.removeAttribute("disabled");
                    img.src = "images/base on brown background.png";
                    touchBase.play()
               })
            }
        } else {
            if(!img.src.includes("gif")) {
                let reelsAudio = PlaySound("reels 02")
                reelsAudio.addEventListener("canplaythrough", function() {              
                    img.src = "images/spinflashing.gif"
                    basebtns.slice(0,3).forEach(function(btn) {
                        btn.querySelector("img").src = "images/baseflashing.gif"
                    })
                    spinCount++;
        e.target.disabled = true;
        wrappers.forEach(function(wrapper, indx) {
            wrapper.classList.remove("end-" + (indx+1))
            wrapper.classList.add("wrapper-"+ (indx+1))
        })
        reelsAudio.play();
        
        setTimeout(function() {
            let rolledItems = []

            wrappers.forEach(function(wrapper, indx) {

                let propName = "--end-pos-"+ (indx+1);
                let randomNum = Math.floor(Math.random() * items.length) + 1;

                let numbToMultiply;
                if(indx >= 1) {
                    rolledItems.push(items[randomNum-1])
                    let dups = rolledItems.every(function(val) {
                        return val === rolledItems[0] && !itemPoints[val];
                    })
                    let randNum = Math.floor(Math.random() * 1)
                    if(dups) {
                        randNum && randomNum != 5 ? randomNum++ : randomNum--;
                    }

                    let allWild = [];
                    rolledItems.slice(0,2).forEach(function(item) {
                        if(item === "wildcard") allWild.push(true)
                    })

                    if(allWild.length >= 2 || (rolledItems.includes("wildcard") && randomNum === 5)) {
                        randNum ? randomNum++ : randomNum--;
                        rolledItems.pop();
                    }

                    let allDiamond = rolledItems.every(function(val) {
                        return val === "diamond"
                    })

                    if(allDiamond) {
                        let rarity = Math.floor(Math.random() * 100) + 1
                        rarity === 1 ? randomNum = randomNum : randomNum = Math.floor(Math.random() * 5) + 1
                    }

                    if(rolledItems.length == indx+1) rolledItems.pop();
                }
                
                if(randomNum === 6) {
                    numbToMultiply = 12
                } else if(randomNum === 1) {
                    numbToMultiply = 4
                } else if (randomNum === 4) {
                    numbToMultiply = 11.2
                } else if(randomNum === 2) {
                    numbToMultiply = 9
                } else if (randomNum === 3) {
                    numbToMultiply = 10.2
                } else if(randomNum === 5) {
                    numbToMultiply = 11.5
                } else {
                    numbToMultiply = 11
                }
                if(rolledItems.length < 3) {
                    rolledItems.push(items[randomNum-1])
                }
                document.documentElement.style.setProperty(propName, "-"+((randomNum * numbToMultiply))+"vw")
                
                let clickAudio = PlaySound("click once");
                clickAudio.addEventListener("canplay", function() {
                    // reelsAudio.addEventListener("ended", function() {
                        setTimeout(function() {
                            wrapper.classList.remove("wrapper-" + (indx+1));
                            wrapper.classList.add("end-" + (indx+1));
                            if(rolledItems[indx] === "wildcard") audioObj.wildcard.play();
                            if(rolledItems[indx] === "diamond") audioObj.diamondAppear.cloneNode(true).play();
                            clickAudio.play();
                            if(indx === 2) sfxScore(rolledItems)
                        }, 500*(indx+1))  
                    // })
                })    
            })

        }, 4100)
                })
            }
        }
    }
    if(e.target.classList.contains("btn-spin")) {
        
    }
});

arrowBtn.addEventListener("click", function(e) {
    arrowClicked++;
    resetBase();
    if(arrowClicked % 2 === 0){
        if(currInnings >= 9) {
            if(awayScore !== homeScore || currInnings === 13) {    
                basebtns.forEach(function(btn) {
                    btn.disabled = true;
                })
                arrowBtn.disabled = true;
                return;
            }
        }
        
        teamBtnImgs[1].src = "images/team window home.png"
        teamBtnImgs[0].src = "images/team window away on blue.png"
        arrowImg.src = "images/arrow top blue.png"
        audioObj.away.cloneNode(true).play();

        scores.push({id: currInnings, scoreArr: [awayScore, homeScore]});

        // sessionStorage.setItem("scores", JSON.stringify(scores));
        currInnings++;

        inningsNum.innerHTML = currInnings;
    } else {
        teamBtnImgs[0].src = "images/team window away.png"
        teamBtnImgs[1].src = "images/team window home on blue.png"
        audioObj.home.cloneNode(true).play();
        
        arrowImg.src = "images/arrow bottom blue.png"
    }
    spinCount = 0;
})

selectInnings.addEventListener("click", function(e) {
    let val = inningsNum.innerHTML - 1;

    if(val < 1) return;

    inningsNum.innerHTML = val;
    let scoreObj;

    scores.forEach(function(arr) {
        if(arr.id === val) {
            scoreObj = arr
            return;
        }
    })

    scoreObj.scoreArr.forEach(function(score, indx) {
        showScores[indx].innerHTML = score;
    })
})
