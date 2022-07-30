// Select Elements
let countSpan = document.querySelector(".count span");
let bullets= document.querySelector('.bullets');
let bulletsSpanContainer = document.querySelector('.bullets .spans');
let quizArea = document.querySelector('.quiz-area');
let answersArea = document.querySelector('.answers-area');
let submitButton= document.querySelector('.submit-button');
let resultsContainer= document.querySelector('.results');
let countdownElement= document.querySelector('.countdown');


let currentIndex = 0;
let rightAnswers = 0;
let countDownInterval;


function getQuestions(){
let myRequest = new XMLHttpRequest();

myRequest.onreadystatechange = function(){

    if(this.readyState === 4 && this.status === 200){
        let questionsObject = JSON.parse(this.responseText);
        let questionsCount = questionsObject.length;
        createBullets(questionsCount);

        addQuetionsData(questionsObject[currentIndex],questionsCount);

        countDown(5,questionsCount)

        //  Click on Button Submit
        submitButton.onclick = ()=>{
            let theRightAnswer = questionsObject[currentIndex].right_answer;
            currentIndex++;

            checkAnswer(theRightAnswer,questionsCount);

            quizArea.innerHTML="";
            answersArea.innerHTML="";
            addQuetionsData(questionsObject[currentIndex],questionsCount);

            handleBullets()

            clearInterval(countDownInterval);
            countDown(5,questionsCount);

            // Show the results
            showResults(questionsCount)
        }
    }
}

myRequest.open('GET',"Questions.json",true);
myRequest.send();

}
getQuestions()

function createBullets(num){
    countSpan.innerHTML = num;

    for(let i=0;i<num;i++){
        let theBullet = document.createElement('span');
        bulletsSpanContainer.appendChild(theBullet);
        if(i === 0){
            theBullet.className ='on';
        }
    }
}

function addQuetionsData(obj,count){
    if(currentIndex < count){
        let questionTitle = document.createElement('h2');

        let questionText = document.createTextNode(obj.title);
       
       questionTitle.appendChild(questionText);
       
       quizArea.appendChild(questionTitle);
       
       // Create the Answer
       
       for (i = 1; i<= 4; i++) {
       let mainDiv = document.createElement('div');
       mainDiv.className = 'answer';
       
       //  Create the Input radio 
       let radioInput = document.createElement('input');
       radioInput.name='question';
       radioInput.type='radio';
       radioInput.id=`answer_${i}`;
       radioInput.dataset.answer = obj[`answer_${i}`];
       
       if(i === 1){
           radioInput.checked = true;
       }
       
       // Create the Lable
       let theLable = document.createElement('label');
       theLable.htmlFor = `answer_${i}`;
       
       let lableText = document.createTextNode(obj[`answer_${i}`]);
       theLable.appendChild(lableText);
       
       mainDiv.appendChild(radioInput);
       mainDiv.appendChild(theLable);
       
       answersArea.appendChild(mainDiv);
       }
    }

}

function checkAnswer (rAnswer,count){
let answers = document.getElementsByName('question')
let theChoosenAnswer;
for(let i =0; i< answers.length; i++){
if(answers[i].checked){
    theChoosenAnswer = answers[i].dataset.answer;
}
}
if(theChoosenAnswer === rAnswer){
    rightAnswers ++;
    console.log("Good Job");
}

}

function handleBullets(){
    let bulletsSpans =document.querySelectorAll(".bullets .spans span");
    let arrayOfSpans = Array.from(bulletsSpans);
    arrayOfSpans.forEach((span,index)=>{
        if(currentIndex === index){
            span.className = 'on';
        }
    })
}

function showResults(count){
    let theResults;
    if(currentIndex === count){
        quizArea.remove();
        answersArea.remove();
        submitButton.remove();
        bullets.remove();
        
            if(rightAnswers > (count/2) && rightAnswers < count ){
                theResults =`<span class ='good'>Good</span>, ${rightAnswers} From ${count}.`
            } else if(rightAnswers === count){
                theResults =`<span class ='perfect'>Perfect</span>, All Answers Are Good.`
            }else{
                theResults =`<span class ='bad'>Bad</span>, ${rightAnswers} From ${count}.` 
            }

            resultsContainer.innerHTML = theResults;
            // to Practice Css inside JavaScript
            resultsContainer.style.padding = '10px';
            resultsContainer.style.backgroundColor = 'white';
            resultsContainer.style.marginTop = '10px';
    }
}

function countDown (duration,count){
    if(currentIndex < count){
        let minutes, seconds;
        countDownInterval = setInterval(()=>{
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);

            minutes = minutes <10 ? `0${minutes}` : minutes;
            seconds = seconds <10 ? `0${seconds}` : seconds;

            countdownElement.innerHTML = `${minutes} : ${seconds}`
            if(--duration < 0){
                clearInterval(countDownInterval);
                submitButton.click();
            }
        },1000);
    }
}