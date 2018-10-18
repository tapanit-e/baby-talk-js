(() => {

	if (typeof InstallTrigger === 'undefined' && ! window.chrome && ! window.chrome.webstore)
		throw new Error('Browser has to be either Chrome or Firefox in order to use Speech API');

	var editDistance = function(text, keyword) {

		if (! text.length) return keyword.length; 
  		if (! keyword.length) return text.length;

  		var matrix = [];

  		var i;
  
		for (i = 0; i <= keyword.length; i++)
    			matrix[i] = [i];

  		var j;
  
		for (j = 0; j <= text.length; j++)
    			matrix[0][j] = j;

  		for (i = 1; i <= keyword.length; i++) {

    			for (j = 1; j <= text.length; j++) {

      				if (keyword.charAt(i - 1) === text.charAt(j - 1)) {
        
					matrix[i][j] = matrix[i - 1][j - 1];
      
				} else {

        				matrix[i][j] = Math.min(
						
						matrix[i - 1][j - 1] + 1, 
                                		matrix[i][j - 1] + 1, 
                                         	matrix[i - 1][j] + 1

					);
      				
				}
    			}
  		}	

  		return matrix[keyword.length][text.length];

	};

	var keywords = [

		'tätä',
                'kakka',
                'äitä',
                'eitä',
                'tata',
                'tele',
                'äää',
                'yyy'

	];

	var code = '';

	try {
  
		var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  		var recognition = new SpeechRecognition();

	} catch(e) {
  
		console.error(e);
	
	}

	recognition.onresult = function(event) {

  		let current = event.resultIndex;

  		let transcript = event.results[current][0].transcript;

		console.log('received ' + transcript);

		let min = Infinity;

		let argMin = 0;
	
		for (let i = 0; i < keywords.length; i++) {

			let distance = editDistance(transcript, keywords[i]);

			if (distance < min) {

				distance = min,
				argMin = i;

			}

		}

		console.log('the most similar keyword was ' + keywords[argMin]);

		code += keywords[argMin] + ' ';

	};

	recognition.onspeechend = function() {

		let lexer = new interpreter.Lexer(code);
		let parser = new interpreter.Parser(lexer.tokens);
		
		new interprepter.Evaluator(parser.parseTree);

		code = '';
		
	};

	recognition.onstart = function() {};

	recognition.onerror = function(event) {
  
		if (event.error == 'no-speech') 
			console.log('No speech');		
	
	};

})();
