let countSpan = document.querySelector('.quiz_info .count span');
let bullets = document.querySelector('.bullets');
let bulletSpansContainer = document.querySelector('.bullets .spans');
let quizArea = document.querySelector('.quiz_area')
let answersArea = document.querySelector('.answers_area')
let submitButton = document.querySelector('.submit-button')
let resultsContainer = document.querySelector('.results')
let countdownElement = document.querySelector('.countdown')
let timeAnswer = 15
let currentIndex = 0
let rightAnswer = 0
let countDownInterval;
function getQuestions() {
    let myRequset = new XMLHttpRequest();
    
    myRequset.onreadystatechange = function() {
        if(this.readyState === 4 && this.status === 200) {
            let questionObject = JSON.parse(this.responseText);
            let qCount = questionObject.length
            addQuestionData(questionObject[currentIndex],qCount);
            creataBullets(qCount);
            countDown(timeAnswer,qCount)
            submitButton.addEventListener('click' , () => {
                let theRightAnswer = questionObject[currentIndex].right_answer
                currentIndex++
                checkAnswer(theRightAnswer, qCount)

                quizArea.innerHTML = ''
                answersArea.innerHTML = ''
                addQuestionData(questionObject[currentIndex],qCount);

                handleBullets()

                showResults(qCount)

                clearInterval(countDownInterval)
                countDown(timeAnswer,qCount)
            })
        }
    };

    myRequset.open('GET' , 'html_question.json' , true);
    myRequset.send();
};
getQuestions();

function creataBullets(num) {
    countSpan.innerHTML = num;
    
    for(let i = 0 ; i < num ; i++){
        let theBullet = document.createElement('span');
        if(i == 0){
            theBullet.className = 'on';
        }
        bulletSpansContainer.appendChild(theBullet);
    }
};
function addQuestionData(obj , count) {
    if(currentIndex < count) {
        let questionTitle = document.createElement('h2');

        let questionText = document.createTextNode(obj.title);
    
        questionTitle.appendChild(questionText);
        quizArea.appendChild(questionTitle);
    
        for(let i = 1 ; i <= 4 ; i++){
            let mainDiv = document.createElement('div')
            mainDiv.className = 'answer'
    
    
            let redioInput = document.createElement('input')
            redioInput.name = 'question';
            redioInput.type = 'radio';
            redioInput.id = `answer_${i}`;
            redioInput.dataset.answer = obj[`answer_${i}`];
            
            if(i == 1){
                redioInput.checked = true
            }
    
            let theLabel = document.createElement('label')
            theLabel.htmlFor = `answer_${i}`
    
            let theLabelText = document.createTextNode(obj[`answer_${i}`]);
            theLabel.appendChild(theLabelText);
            mainDiv.appendChild(redioInput)
            mainDiv.appendChild(theLabel)
    
            
            answersArea.appendChild(mainDiv)
        }
    }
}


function checkAnswer(rAnswer, count){
    let answers = document.getElementsByName('question')
    let theChoosenAnswer;

    for(let i = 0 ; i < answers.length ; i++){
        if(answers[i].checked){
            theChoosenAnswer = answers[i].dataset.answer;
        }
    }
    if(rAnswer === theChoosenAnswer){
        rightAnswer++
    }
}

function handleBullets(){
    let bulletsSpans = document.querySelectorAll('.bullets .spans span');
    let arrayOfSpans = Array.from(bulletsSpans);
    arrayOfSpans.forEach((span,index) => {
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

        if(rightAnswer > (count / 2 && rightAnswer < count)){
            theResults = `<span class="good">Good</span> ${rightAnswer} Form ${count}.`;
        } else if(rightAnswer === count){
            theResults = `<span class="good">Good</span> All Answers Is Good.`;
        } else {
            theResults = `<span class="bad">Bad</span> ${rightAnswer} Form ${count}.`;
        }
        resultsContainer.innerHTML = theResults
    }
}

function countDown(duration,count){
    if(currentIndex < count) {
        let minites , seconds;
        countDownInterval = setInterval(() => {
            minites = parseInt(duration / 60)
            seconds = parseInt(duration % 60)
            minites = minites < 10 ? `0${minites}` : minites ;
            seconds = seconds < 10 ? `0${seconds}` : seconds ;
            countdownElement.innerHTML = `${minites}:${seconds}`;

            if(--duration < 0){
                clearInterval(countDownInterval)
                submitButton.click()
            }
        }, 500)
    }
}
