$(function() {

    var prompt = {

        options: {
            typeSpeed: 75,
            distortionSpeed: 200
        },

        distortionChars: ['&#8709;', '&#8704;', '&#916;', '&#8364;', '&#915;', '&#174;', 'Z', 'X'],
        distorting: false,

        input: true,

        init: function() {
            this.distort();
            this.initInput();
        },

        initInput: function() {
            var self = this;
            window.onkeydown = function(e) {
                // TODO: update this to only prevent for a few buttons
                e.preventDefault();
                if (!self.input) return false;
                var k = e.which || e.keyCode;
                // TODO: check for enter & other keys
                var input = $('.prompt .input');
                var text = input.text();
                text = text + String.fromCharCode(k);
                input.text(text);
            };
        },

        print: function(arr, speed) {
            this.distorting = true; // dont distort while we write
            this.input = false;
            var speed = speed || this.options.typeSpeed;
            this.printStep(arr, speed, this);
        },

        printStep: function(que, speed, prompt) {
            var line = que.shift();
            if (!line) {
                // print stack is done
                prompt.distorting = false;
                prompt.input = true;
                $('.prompt').append('<div class="line input"></div>');
                return false;
            }
            prompt.printLine(line, function() {
                prompt.printStep(que, speed, prompt)
            }, speed);
        },

        printLine: function(str, callback, speed) {
            $('.prompt').append('<div class="line output active"></div>');
            var line = $('.prompt .line').last();
            var letters = str.split('');
            var i = 0;
            var printTimer = setInterval(function() {
                var text = line.text();
                line.text(text + letters[i]);
                i++;
                if (i === letters.length) {
                    line.removeClass('active');
                    clearInterval(printTimer);
                    callback();
                }
            }, speed);
        },

        distort: function() {
            var self = this;
            var distortTimer = setInterval(function() {
                var rand1 = Math.round(Math.random() * 15);
                if (rand1 === 2 && !self.distorting) {
                    self.distorting = true;
                    var lines = $('.prompt .output');
                    var rand2 = Math.floor(Math.random() * lines.length);
                    var line = lines.eq(rand2);
                    var ogText = line.text();
                    var letters = ogText.split('');
                    var rand3 = Math.floor(Math.random() * letters.length);
                    var rand4 = Math.floor(Math.random() * self.distortionChars.length);
                    letters[rand3] = self.distortionChars[rand4];
                    var newText = letters.join('');
                    line.html(newText);
                    setTimeout(function() {
                        line.html(ogText);
                        self.distorting = false;
                    }, 500);
                }
            }, self.options.distortionSpeed);
        }

    };

    prompt.init();
    prompt.print(['Hello World', 'This is a test'], 30);

});
