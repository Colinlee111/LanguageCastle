class CastleChallenge {
    constructor() {
        // 平台导航配置
        this.platforms = {
            'Amazon': '全球最大跨境电商平台...',
            'Temu': '新兴全托管电商平台...',
            'TikTokShop': '短视频社交电商平台...',
            'SHEIN': '快时尚跨境电商巨头...'
        };

        // 初始化平台导航
        this.initPlatformNavigation();

        // 题目数据库
        this.questions = [
            {
                type: 'english',
                question: "The ___ climbs the tree quickly. (猴子)",
                answer: "monkey",
                blanks: 1,
                difficulty: 1
            },
            {
                type: 'chinese',
                question: "白日依山尽，黄河入海流。欲穷___目，更上一层楼。",
                answer: "千里",
                blanks: 1,
                difficulty: 2
            },
            {
                type: 'english',
                question: "I have two ___ (苹果) in my bag.",
                answer: "apples",
                blanks: 1,
                difficulty: 1
            },
            {
                type: 'chinese',
                question: "床前明月光，疑是地上___。",
                answer: "霜",
                blanks: 1,
                difficulty: 2
            }
        ];
        this.time = 60;
        this.score = 0;
        this.currentQuestion = null;
        this.timerId = null;
        this.isPlaying = false;
    }

    startGame() {
        if (this.isPlaying) return;
        
        this.isPlaying = true;
        this.time = 60;
        this.score = 0;
        document.getElementById('score').textContent = this.score;
        document.querySelectorAll('button')[0].disabled = true;
        this.loadQuestion();
        this.startTimer();
    }

    startTimer() {
        this.timerId = setInterval(() => {
            this.time--;
            document.getElementById('time').textContent = this.time;
            
            if (this.time <= 0) {
                this.gameOver();
            }
        }, 1000);
    }

    loadQuestion() {
        this.currentQuestion = this.questions[Math.floor(Math.random() * this.questions.length)];
        const questionElement = document.getElementById('question');
        const parts = this.currentQuestion.question.split('___');
        
        questionElement.innerHTML = parts.map((part, index) => {
            return index < parts.length - 1 ? 
                `${part}<input type="text" class="input-blank" data-index="${index}">` : 
                part;
        }).join('');
    }

    submitAnswer() {
        if (!this.isPlaying) return;

        const inputs = Array.from(document.getElementsByClassName('input-blank'));
        const userAnswers = inputs.map(input => input.value.trim().toLowerCase());
        const correctAnswers = this.currentQuestion.answer.toLowerCase().split(',');

        const allCorrect = userAnswers.every((answer, index) => 
            answer === correctAnswers[index]
        );

        const feedbackElement = document.getElementById('feedback');
        if (allCorrect) {
            this.score += this.currentQuestion.difficulty * 10;
            this.time += 5;
            document.getElementById('score').textContent = this.score;
            feedbackElement.textContent = '🎉 答案正确！+5秒奖励';
            feedbackElement.className = 'feedback-box correct-answer';
        } else {
            this.time -= 5;
            feedbackElement.textContent = '💥 答案错误！-5秒惩罚';
            feedbackElement.className = 'feedback-box wrong-answer';
        }
        feedbackElement.style.opacity = 1;
        
        setTimeout(() => {
            if (this.isPlaying) this.loadQuestion();
        }, 1500);
    }

    gameOver() {
        clearInterval(this.timerId);
        this.isPlaying = false;
        document.querySelectorAll('button')[0].disabled = false;
        document.getElementById('question').innerHTML = 
            `🏁 游戏结束！最终得分：${this.score}盾牌<br>
            最高记录：${Math.max(this.score, localStorage.getItem('highScore') || 0)}`;
        localStorage.setItem('highScore', Math.max(this.score, localStorage.getItem('highScore') || 0));
    }
}

const game = new CastleChallenge();
window.startGame = () => game.startGame();
window.submitAnswer = () => game.submitAnswer();
