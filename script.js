document.addEventListener('DOMContentLoaded', function () {
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');
    const wordBox = document.getElementById('word');
    const partOfSpeechBox = document.getElementById('part-of-speech');
    const definitionBox = document.getElementById('definition');

    function fetchWordDefinition(word) {
        const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.title) {
                    wordBox.textContent = "Word not found!";
                    partOfSpeechBox.textContent = '';
                    definitionBox.textContent = '';
                } else {
                    const wordData = data[0];

                    const meanings = wordData.meanings;

                    const firstNonNounMeaning = meanings.find(meaning => meaning.partOfSpeech !== "noun");

                    const relevantMeaning = firstNonNounMeaning || meanings[0];

                    const wordDefinition = relevantMeaning.definitions[0].definition;
                    const partOfSpeech = relevantMeaning.partOfSpeech;

                    wordBox.textContent = wordData.word;
                    partOfSpeechBox.textContent = partOfSpeech;
                    definitionBox.textContent = wordDefinition;
                }
            })
            .catch(error => {
                wordBox.textContent = "An error occurred.";
                partOfSpeechBox.textContent = '';
                definitionBox.textContent = '';
            });
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
