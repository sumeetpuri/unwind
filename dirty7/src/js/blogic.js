const deckOfCards = ["AS", "KS", "QS", "JS", "10S", "9S", "8S", "7S", "6S", "5S", "4S", "3S", "2S", "AH", "KH", "QH", "JH", "10H", "9H", "8H", "7H", "6H", "5H", "4H", "3H", "2H", "AD", "KD", "QD", "JD", "10D", "9D", "8D", "7D", "6D", "5D", "4D", "3D", "2D", "AC", "KC", "QC", "JC", "10C", "9C", "8C", "7C", "6C", "5C", "4C", "3C", "2C"];
            
var myHand = {"cards" : []};
//var myHand = {"cards" : ["5D", "7C", "KD", "QD", "AS", "JH", "5D"]};
var openCard = "";
var oldOpenCard ="";
const imgpath = "./images/cards/";
const imgext = ".jpg";

var jFlag = false;
var isSuitSet = false;
var openCardSuit = "";

var is7Flag = "false";
var countCardPick = 0;

var aFlag = false;



function deal() {
    //this method should be centralized, so send a message to deal?

    //assign 7 random cards to each player
    myHand = {"cards" : []};
    for (let index = 0; index < 7; index++) {
        myHand.cards.push (getRandomCard());                    
    }
    
    //assign open card
    openCard = getRandomCard();
    oldOpenCard = openCard;
    openCardSuit = openCard.substring(1,2);
    console.log("openCardSuit="+openCardSuit);

    repaintCards();
    document.getElementById("suits").style.display='none';
}

function validateThrow() {
    console.log(openCard);
    console.log(oldOpenCard);
    console.log("JFlag="+jFlag + " isSetSuit="+isSuitSet + " open suit="+ openCardSuit + " countCardPick="+countCardPick);
    //code all the validation business rules
    //this method should be centralized

    // handle J
    if (openCard === "JH" || openCard === "JS" || openCard === "JC" || openCard === "JD") {
        if(is7Flag === true) {
            //you can't throw a J, as the open card is a 7
            showError("You can only throw a 7, or pick " + countCardPick + " cards");
            return;
        }
        document.getElementById("suits").style.display='block';
        //set the J flag - this is needed as the next card should be the same suit.
        jFlag = true;
        return true;
    }

    if(jFlag === true) {
        //the previous card was J
        if(isSuitSet !== true) {
            //error, as a card was thrown after J without setting a suit
            showError("Please select new suit");
            return false;
        }
        else {
            //Suit was selected, 

            //check if card thrown matches suit
            if(openCard.slice(openCard.length-1) !== openCardSuit ) {
                showError("You must throw the select Suit -"+openCardSuit+"-");
                return false;
            }
            else {
                //card matches suit
                //reset jFlag
                jFlag = false;
                isSuitSet = false;
                return true;
            }


        }

    }

    //validate same suit or the same number
    if(openCard.slice(openCard.length-1) !== oldOpenCard.slice(oldOpenCard.length-1) && openCard.substring(0, openCard.length-1) !== oldOpenCard.substring(0, oldOpenCard.length-1) ){
        //console.log("Open Suit"+ openCard.slice(openCard.length-1) + " Old Suit:"+ oldOpenCard.slice(oldOpenCard.length-1));
        //if the previous card was 7, throw specific error
        if(is7Flag === true){
            showError("You can only throw a 7, or pick " + countCardPick + " cards");
        }
        else {
            showError("Please throw the same suit or number");
        }
        return false;

    }

    //special case of 7

    if (openCard === "7H" || openCard === "7S" || openCard === "7C" || openCard === "7D") {
        console.log("dirty 7 thrown");
        //set the 7 flag - this is needed as the next card should be the same suit.
        //validate that the next step is either 7 or pick 2 cards
        countCardPick = countCardPick + 2;
        is7Flag = true;
        return true;
    }
    //next round after first 7. Pick will clear the flag and count.
    if(is7Flag === true) {
        console.log("is7Flag ="+is7Flag);
        //you can't throw a card, you must pick cards
        showError("You can only throw a 7, or pick " + countCardPick + " cards");
        return false;        
    }  

    //handle A
    if (openCard === "AH" || openCard === "AS" || openCard === "AC" || openCard === "AD") {
        console.log("A thrown");
        //set the A flag - this means that the next turn is missed
        //validate that the next step is either 7 or pick 2 cards
        isAFlag = true;
        return true;
    }
 


    return true;

}

function newSuit(suit) {
    console.log("Called newSuit("+ suit +")");
    openCardSuit = suit;
    isSuitSet = true;
    console.log("changeSuit "+isSuitSet);
    showError("Selected suit is "+suit);
    //hide suit selector
    document.getElementById("suits").style.display='none';
}

function printCards(array) {
    array.forEach(element => {
        console.log (element + ", ");
    });
}

//this function repaints player's cards
function repaintCards() {

    //repaint the open card
    document.getElementById("openCard").src = getCardSrc(openCard);

    //Clear the row and add an empty row
    tableMyHand = document.getElementById("tbMyHand");
    tableMyHand.deleteRow(-1);
    rowMyHand = tableMyHand.insertRow();
    
    //iterate through the hand array and insert the cells accordingly
    //alert ("in show my cards" + myHand.cards[0]);
    for(i in myHand.cards) {
        //alert("in show loop " + myHand.cards[i]);
        newcell = rowMyHand.insertCell();
        newcell.innerHTML = '<img id="' + myHand.cards[i] + '" src="'+getCardSrc(myHand.cards[i])+'" height="100" width="70" onclick="throwCard(\'' + myHand.cards[i] + '\');">';
    }

    printCards(myHand.cards);

    if (myHand.cards.length === 0) {
        showError("You have won!!");
    }
}

function getRandomCard() {

    //return any of the 52 cards
    //ideally run on the server
    randCardId = Math.floor((Math.random() * 51) + 1);
    return deckOfCards[randCardId];

}

function getCardSrc(card){
    return imgpath + card + imgext;
}


function throwCard(card){
    //alert("throwCard "+ card);
    //alert("Card thrown "+document.getElementById(card).src);
    //alert("openCard "+document.getElementById("openCard").src);

    //2. update the open card but keep existing card state for validation
    oldOpenCard = openCard;
    openCard = card;

    clearError();

    //validate the throw as per rules
    if(validateThrow() === true) {

        //3. update the hand by removing the card
        const index = myHand.cards.indexOf(card);
        //alert("found card at " + index);
        if (index !== undefined) myHand.cards.splice(index, 1);
        //4. repaint
        repaintCards();
    }
    else {
        //reset the open card as no card was thrown
        openCard = oldOpenCard;
    }


     
}

//Pick a card from the pile
function pickCard() {
    clearError();

    if(is7Flag === true) {
        countCardPick --;
        if(countCardPick === 0) {
            is7Flag = false;
        }
    }
    if(jFlag === true) {
        showError("You must select a suit first!"); 
    }
    else {
        //ideally run on the server
        myHand.cards.push(getRandomCard());

        //4. repaint
        repaintCards();
    }


}

function showError(err) {
    document.getElementById("divError").innerHTML = err;
}

function clearError() {
    showError("");
}