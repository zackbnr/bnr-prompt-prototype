$(function() {

    var prompt = {

        options: {
            typeSpeed: 15,
            distortionSpeed: 100
        },

        distortionChars: ['&#8709;', '&#8704;', '&#916;', '&#8364;', '&#915;', '&#174;', 'Z', 'X'],
        distorting: false,

        input: false,
        inputStr: '',
        inputVals: {},

        storyStep: 1, // NOTE: this is specific to the intro

        init: function() {
            this.distort();
        },

        getInput: function() {
            var self = this;
            return new Promise(function(resolve, reject) {
                self.startInput(resolve);
            });
        },

        startInput: function(resolve) {
            var self = this;
            window.onkeydown = function(e) {

                if (!self.input) return false;
                self.input = true;

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
                        self.enterCommand(resolve);
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

        // NOTE: this contents of this function are specific to the intro
        enterCommand: function(resolve) {
            // TODO: check for null value
            if (this.storyStep == 1) {
                this.inputVals.name = this.inputStr;
            }
            if (this.storyStep == 2) {
                if (this.inputStr == 'YES' || this.inputStr == 'Y') {
                    this.inputVals.mood = "rain";
                }
                if (this.inputStr == 'NO' || this.inputStr == 'N') {
                    this.inputVals.mood = "sun";
                }
            }
            if (this.storyStep == 3) {
            }
            $('.prompt .input').remove();
            $('.prompt').append('<div class="line output">' + this.inputStr + '</div>');
            $('.prompt .output').last().css('color', 'white');
            this.inputStr = '';
            this.storyStep++;
            resolve();
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
                $('.prompt').append('<div class="line input"></div>');
                prompt.input = true;
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
            var self = this;
            var p = $('.prompt');
            console.log('p.scrollTop()', p.scrollTop());
            console.log('p.height()', p.height());
            $('.prompt').append('<div class="line output active"></div>');
            var line = $('.prompt .line').last();
            var letters = str.split('');
            var i = 0;
            var printTimer = setInterval(function() {
                var text = line.text();
                if (letters[i] == '_') {
                    line.css('padding-left', '50px');
                } else {
                    line.text(text + letters[i]);
                    self.scroll();
                }
                i++;
                if (i === letters.length) {
                    line.removeClass('active');
                    clearInterval(printTimer);
                    callback();
                }
            }, speed);
        },

        // helper function to move the lines up the screen
        scroll: function() {
            var p = $('.prompt');
            var w = $(window);
            if (p.height() > w.height()) {
                var diff = p.height() - w.height();
                console.log('diff', diff);
                p.css('margin-top', diff + 'px');
            }
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

    prompt.print(['Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus euismod, lorem vitae condimentum pharetra, libero risus molestie elit, eget accumsan orci ipsum nec lacus. Praesent mattis felis vel mi aliquet, sed sollicitudin nibh hendrerit. Pellentesque tincidunt pretium est id tristique. Curabitur nec velit pharetra, tristique nisl eget, blandit ex. Vestibulum rhoncus elementum porttitor. Mauris tristique nibh eget volutpat gravida. Pellentesque fringilla enim sed orci sollicitudin varius. Donec egestas dui sed enim ultrices, quis molestie nisi rhoncus. Mauris non accumsan sapien, nec imperdiet justo. Etiam tempus tempor varius. Sed efficitur leo enim. Ut viverra ex cursus neque ornare, ac sollicitudin justo porttitor. Curabitur egestas in lectus a molestie. Proin mollis orci vel suscipit convallis. Praesent tincidunt hendrerit nibh, pulvinar vestibulum velit varius et. Nunc quis imperdiet nibh.', ' ',
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus euismod, lorem vitae condimentum pharetra, libero risus molestie elit, eget accumsan orci ipsum nec lacus. Praesent mattis felis vel mi aliquet, sed sollicitudin nibh hendrerit. Pellentesque tincidunt pretium est id tristique. Curabitur nec velit pharetra, tristique nisl eget, blandit ex. Vestibulum rhoncus elementum porttitor. Mauris tristique nibh eget volutpat gravida. Pellentesque fringilla enim sed orci sollicitudin varius. Donec egestas dui sed enim ultrices, quis molestie nisi rhoncus. Mauris non accumsan sapien, nec imperdiet justo. Etiam tempus tempor varius. Sed efficitur leo enim. Ut viverra ex cursus neque ornare, ac sollicitudin justo porttitor. Curabitur egestas in lectus a molestie. Proin mollis orci vel suscipit convallis. Praesent tincidunt hendrerit nibh, pulvinar vestibulum velit varius et. Nunc quis imperdiet nibh.'], 3);

    // prompt.print(['Welcome to Black and Red.', 'We are a group of talented web designers and developers with a knack for immaculate code.'])
    // .then(function() {
    //     return pause(500);
    // })
    // .then(function() {
    //     return prompt.print([' ', 'If you are reading this sentence then you have already passed initial authorization.']);
    // })
    // .then(function() {
    //     return pause(300);
    // })
    // .then(function() {
    //     return prompt.print(['Please provide your full name:', ' ']);
    // })
    // .then(function() {
    //     return prompt.getInput();
    // })
    // .then(function() {
    //     return pause(300);
    // })
    // .then(function() {
    //     var name = prompt.inputVals.name;
    //     var first_name = name.split(' ')[0];
    //     return prompt.print([' ', 'Hello ' + first_name + '.', ' ']);
    // })
    // .then(function() {
    //     return prompt.print(['. . .'], 250);
    // }).
    // then(function() {
    //     return prompt.print([' ', 'The following is a poem by Robert Nathan.', 'Please read it carefully...', ' ']);
    // })
    // .then(function() {
    //     return prompt.print([
    //         '_Beauty is ever to the lonely mind',
    //         '_A shadow fleeting; she is never plain.',
    //         '_She is a visitor who leaves behind',
    //         '_The gift of grief, the souvenir of pain.'
    //     ], 10);
    // })
    // .then(function() {
    //     return prompt.print([' ', 'Do you feel that this poem accurately describes beauty despite it\'s brevity? [y/n]', ' ']);
    // })
    // .then(function() {
    //     return prompt.getInput();
    // })
    // .then(function() {
    //     return prompt.print([' ']);
    // })
    // .then(function() {
    //     return prompt.print(['. . .'], 250);
    // })
    // .then(function() {
    //     return prompt.print([' ', 'Black and Red would like to access your camera and microphone to enhance your experience on our interface',
    //         'Would you allow us access? [y/n]', ' ']);
    // })
    // .then(function() {
    //     return prompt.getInput();
    // })
    // .then(function() {
    //     return prompt.print([' ', 'Let us begin . . .']);
    // });

});
