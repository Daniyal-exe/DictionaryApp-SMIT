document.addEventListener('DOMContentLoaded', function () {
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');
    const wordBox = document.getElementById('word');
    const phoneticsBox = document.getElementById('phonetics');
    const meaningsBox = document.getElementById('meanings');
    const synonymsBox = document.getElementById('synonyms');
    const antonymsBox = document.getElementById('antonyms');
    const originBox = document.getElementById('origin');
    const examplesBox = document.getElementById('examples');

    function fetchWordDefinition(word) {
        const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.title) {
                    wordBox.textContent = "Word not found!";
                    clearResults();
                } else {
                    const wordData = data[0];
                    const { meanings, phonetics, origin } = wordData;

                    wordBox.textContent = wordData.word;

                    clearResults();

                    phonetics.forEach(phonetic => {
                        const phoneticText = phonetic.text || '';
                        const audioButton = phonetic.audio ? `<button class="audio-button" onclick="new Audio('${phonetic.audio}').play()"><i class="ri-volume-up-fill"></i></button>` : '';
                        phoneticsBox.innerHTML += `${phoneticText} ${audioButton}<br>`;
                    });
    
                    
                    const uniquePartsOfSpeech = new Set();
                    meanings.forEach(meaning => {
                        const { partOfSpeech, definitions } = meaning;
                        if (!uniquePartsOfSpeech.has(partOfSpeech)) {
                            uniquePartsOfSpeech.add(partOfSpeech);
                            const definition = definitions[0];
                            meaningsBox.innerHTML += `<b>${partOfSpeech}:</b> ${definition.definition}<br>`;
                            if (definition.example) {
                                examplesBox.innerHTML += `Example: ${definition.example}<br>`;
                            }
                        }
                    });
    
                    const allSynonyms = meanings.flatMap(meaning => meaning.synonyms).slice(0, 4);
                    const allAntonyms = meanings.flatMap(meaning => meaning.antonyms).slice(0, 4);
    
                    synonymsBox.textContent = allSynonyms.length ? `Synonyms: ${allSynonyms.join(', ')}` : '';
                    antonymsBox.textContent = allAntonyms.length ? `Antonyms: ${allAntonyms.join(', ')}` : '';
                        
                    originBox.textContent = origin ? `Origin: ${origin}` : '';
                }
            })
            .catch(error => {
                wordBox.textContent = "An error occurred.";
                clearResults();
            });
    }
    

    function clearResults() {
        phoneticsBox.innerHTML = '';
        meaningsBox.innerHTML = '';
        synonymsBox.textContent = '';
        antonymsBox.textContent = '';
        originBox.textContent = '';
        examplesBox.innerHTML = '';
    }

    searchButton.addEventListener('click', function () {
        const word = searchInput.value.trim();
        if (word) {
            fetchWordDefinition(word);
        }
    });

    searchInput.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            const word = searchInput.value.trim();
            if (word) {
                fetchWordDefinition(word);
            }
        }
    });
});
