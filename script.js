const $audioTag = document.getElementById('audio'),
    $score = document.getElementById('score'),
    $step = document.getElementById('steps'),
    $timer = document.getElementById('timer'),
    $start = document.getElementById('start'),
    $board = document.getElementById('board'),
    cards = [
        {
            answer: 'russia',
            image: 'https://upload.wikimedia.org/wikipedia/en/f/f3/Flag_of_Russia.svg'
        },
        {
            answer: 'israel',
            image: 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Flag_of_Israel.svg'
        },
        {
            answer: 'america',
            image: 'https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg'
        },
        {
            answer: 'china',
            image: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Flag_of_the_People%27s_Republic_of_China.svg'
        },
        {
            answer: 'brazil',
            image: 'https://upload.wikimedia.org/wikipedia/en/0/05/Flag_of_Brazil.svg'
        },
        {
            answer: 'canada',
            image: 'https://upload.wikimedia.org/wikipedia/commons/d/d9/Flag_of_Canada_%28Pantone%29.svg'
        }
    ];

    const soundsUrls = {
        match: './src/match.mp3',
        unmatch: './src/unmatch.mp3',
        win: './src/Win.mp3',
        loose: './src/gameover.mp3'};

let timerInterval,
    selection = [],
    timer = 120,
    steps = 0,
    score = 3;

const shuffle = (arrayOfItems) => {
    let counter = arrayOfItems.length;

    while (counter > 0) {
        let index = Math.floor(Math.random() * counter);
        counter--;
        let temp = arrayOfItems[counter];
        arrayOfItems[counter] = arrayOfItems[index];
        arrayOfItems[index] = temp;
    }

    return arrayOfItems;
}

const countTime = () => {
    timerInterval = setInterval(() => {
        --timer;
        $timer.innerText = timer;

        if (timer === 0) {
            $audioTag.src = soundsUrls.loose;
            $audioTag.play();
            clearInterval(timerInterval);
            setTimeout(() => {
                Swal.fire({
                    title: 'Game Over: Time is up try again',
                    icon: 'error',
                    showConfirmButton: true,
                    showCancelButton: true,
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Play Again'
                }).then((result) => {
                    if (result.isConfirmed) {
                        startGame();
                    }
                    else{
                        $start.classList.remove('hide');
                    }

                })
            }, 800);

        }
    }, 1000);
}

const countStep = () => {
    ++steps;
    $step.innerText = steps;
}

const calcScore = () => {
    const rating3Limit = (cards.length / 2) + 2,
        rating2Limit = cards.length,
        rating1Limit = (cards.length * 1.5);

    const is3Stars = steps <= rating3Limit,
        is2Stars = steps >= rating2Limit && steps < rating1Limit,
        is1star = steps >= rating1Limit;

    if (is3Stars) {
        score = 3;
    } else if (is2Stars) {
        score = 2;
    } else if (is1star) {
        score = 1;
    }
    $score.innerText = score;
}

const checkIfGameOver = () => {
    const openCards = (document.getElementsByClassName('open')).length;

    if ((cards.length * 2) === openCards) {
        $audioTag.src = soundsUrls.win;
        $audioTag.play();
        clearInterval(timerInterval);
        setTimeout(() => {
            Swal.fire({
                title: 'You Win',
                icon: 'success',
                showConfirmButton: true,
                showCancelButton: true,
                cancelButtonColor: '#d33',
                confirmButtonText: 'Play Again'
            }).then((result) => {
                if (result.isConfirmed) {
                    startGame();

                }
                else{
                    $start.classList.remove('hide');
                }
            })
        }, 800)

    }
}

const checkGameState = () => {
    countStep();
    calcScore();
    checkIfGameOver();
}

const printCards = (cardsArray) => {
    const shuffledCards = shuffle([...cardsArray, ...cardsArray]);
    $board.innerHTML = '';
    shuffledCards.forEach((card) => {
        const liElement = document.createElement('li');
        liElement.dataset.answer = card.answer;
        const imgElement = document.createElement('img');
        imgElement.src = card.image;
        imgElement.alt = card.answer;
        imgElement.title = card.answer;

        liElement.appendChild(imgElement);
        $board.appendChild(liElement);
    })
}

const startGame = () => {
    timer = 121;

    printCards(cards);
    countTime();
}

const flipCards = (isCorrect) => {
    $board.classList.add('compare');
    setTimeout(() => {
        const flippedCards = Array.from(document.getElementsByClassName('flip'));
        flippedCards.forEach(card => {
            if (isCorrect) {
                $audioTag.src = soundsUrls.match;
                $audioTag.play();
                card.classList.replace('flip', 'open');
            } else {
                $audioTag.src = soundsUrls.unmatch;
                $audioTag.play();
                card.classList.remove('flip');
            }
        });
        $board.classList.remove('compare');
        checkGameState();
    }, 800);
}

$board.addEventListener('click', ($event) => {
    const isCard = $event.target.localName === 'li';
    const isOpenedCard = $event.target.classList.contains('open');
    const isFlippedCard = $event.target.classList.contains('flip');
    if (!isCard || isOpenedCard || isFlippedCard) { return; }

    const currentUserSelection = $event.target.dataset.answer;
    $event.target.classList.add('flip');
    selection.push(currentUserSelection);

    if (selection.length === 2) {
        const isCorrectAnswer = selection[0] === selection[1];
        flipCards(isCorrectAnswer);
        selection = [];
    }
})

$start.addEventListener('click', () => {
    startGame();
    $start.classList.add('hide');
})
