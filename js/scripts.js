$(function() {

    var prompt = {

        options: {
            typeSpeed: 25,
            distortionSpeed: 100
        },

        distortionChars: ['&#8709;', '&#8704;', '&#916;', '&#8364;', '&#915;', '&#174;', 'Z', 'X'],
        distorting: false,

        input: true,
        inputStr: '',

        init: function() {
            this.distort();
            this.initInput();
        },

        initInput: function() {
            var self = this;
            window.onkeydown = function(e) {

                if (!self.input) return false;

                var k = e.which || e.keyCode;
                var cancel = false;

                if (e.ctrlKey || e.altKey || e.metaKey) {
                    cancel = true;
                }
                if (k == 9 || k == 38 || k == 40 || k == 37 || k == 39 || k == 91) {
                    cancel = true;
                }

                if (!cancel) {
                    e.preventDefault();
                    if (k == 13) {
                        // enter command
                    } else if (k == 8) {
                        var input = $('.prompt .input');
                        var text = input.text();
                        text = text.substr(0, text.length - 1);
                        input.text(text);
                        self.inputStr = text;
                    } else {
                        var input = $('.prompt .input');
                        var text = input.text();
                        text = text + String.fromCharCode(k);
                        input.text(text);
                        self.inputStr = text;
                    }
                }

            };
        },

        print: function(arr, speed) {
            var self = this;
            var speed = speed || self.options.typeSpeed;
            if (!!$('.input').length) {
                $('.input').remove();
            }
            return new Promise(function(resolve, reject) {
                self.distorting = true; // dont distort while we write
                self.input = false;
                self.printStep(arr, speed, self, resolve);
            });
        },

        printStep: function(que, speed, prompt, resolve) {
            var line = que.shift();
            if (!line) {
                // print stack is done
                prompt.distorting = false;
                prompt.input = true;
                $('.prompt').append('<div class="line input"></div>');
                if (!!prompt.inputStr) {
                    $('.input').text(prompt.inputStr);
                }
                resolve();
                return false;
            }
            prompt.printLine(line, function() {
                prompt.printStep(que, speed, prompt, resolve)
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
                    if (line.text() !== ' ') {
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
                }
            }, self.options.distortionSpeed);
        }

    };

    // helper function
    var pause = function(duration) {
        return new Promise(function(resolve, reject) {
            setTimeout(function() {
                resolve();
            }, duration);
        });
    };

    prompt.init();

    prompt.print([
        'Welcome to Black and Red.',
        'We are a group of talented web designers and developers with a knack for immaculate code.'
    ])
    .then(function() {
        return pause(500);
    })
    .then(function() {
        return prompt.print([
            ' ',
            'If you are reading this sentence then you have already passed initial authorization.'
        ]);
    })
    .then(function() {
        return pause(300);
    })
    .then(function() {
        return prompt.print(['Please provide your full name:', ' '])
    });

});
