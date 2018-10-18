var interpreter = (() => {

	var Lexer = function(code) {

		this.tokens = [];

		this.index = 0;

		while (this.index < code.length) {

			var c = code[this.index];

			if (this.isWhitespace(c)) this.index++;
			else if (this.isChar(c)) {

				var command = c;

				while (++this.index < code.length && this.isChar(code[this.index])) {

					command += code[this.index];

				}

				this.index++;

				if (Lexer.commands[command])
					this.tokens.push({ command: command, type: Lexer.commands[command] });

			} else {

				throw new Error('Unsupported token');

			}

		}


	};

	// ENTER TALK HERE
	Lexer.commands = {

		'tätä': '++',
		'kakka': '--',
		'äitä': '*ptr++',
		'eitä': '*ptr--',
		'tata': 'readLine',
		'tele': 'puts',
		'äää': 'branch',
		'yyy': 'end branch'

	};

	Lexer.prototype.isWhitespace = function(token) {

		return (/^\s*$/.test(token));

	};

	Lexer.prototype.isChar = function(token) {

		console.log(token);

		return token.match(/[a-z]/i);

	};

	var Parser = function(tokens) {

		this.parseTree = [];

		this.blocks(this.parseTree, 0);

	};

	Parser.prototype.blocks = function(tokens, index) {

		for (let i = index; i < tokens.length; i++) {

                        switch (tokens[i].type) {

                                case '++':
                                        tokens.push('+= 1');
                                        break;
                                case '--':
                                        tokens.push('-= 1');
                                        break;
                                case '*ptr++':
                                        tokens.push('++');
                                        break;
                                case '*ptr--':
                                        tokens.push('--');
                                        break;
                                case 'readLine':
                                        tokens.push('readLine');
                                        break;
                                case 'puts':
                                        tokens.push('puts');
                                        break;
                                case 'branch':
       					tokens.push('while 0 then branch')
					var block = [];
					tokens.push(block);
					this.blocks(block, 0);
					break;
				case 'end branch':
					tokens.push('end branch')
					return;

                        }

                }


	};


	var Evaluator = function(parseTree) {

		this.tape = [];
		this.index = 0;

		for (let i = 0; i < parseTree.length; i++) {

			if (! Array.isArray(parseTree[i]))
				this.run(parseTree[i], parseTree, i);

		}

	};

	Evaluator.prototype.run = function(node, parseTree, index) {

		switch (node) {

			case '+= 1':
				this.index++;
				break;
			case '-= 1':
				this.index--;
				break;
			case '++':
				this.tape[this.index] = this.tape[this.index] ? this.tape[this.index] + 1 : 1
				break;
			case '--':
				if (this.index === 0)
					throw new Error('Tape index out of bounds exception.');
				this.tape[this.index] = this.tape[this.index] ? this.tape[this.index] - 1 : -1
				break;
			case 'while 0 then branch':

				var value = this.tape[this.index];

				var block = parseTree[index + 1];

				while (value !== 0) {

					for (let i = 0; i < block.length; i++)
						this.run(block[i], block, i);

				}



				break;
			case 'end branch':
				return;
				break;
			case 'puts':
				console.log(this.tape[this.index]);
				break;
			case 'readline':
				
				let input = readline.question('');
				
				if (! isNaN(input))
					throw new Error('Input mismatch exception.');

				input = parseInt(input);

				this.tape[this.index] = input;
		}

	};


	return {

		Lexer: Lexer,
		Parser: Parser,
		Evaluator: Evaluator

	};

})();
