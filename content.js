fetch(chrome.runtime.getURL("dictionary.json"))
  .then((response) => response.json())
  .then((dictionary) => {
    function replaceWords(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        let text = node.nodeValue;
        for (const britishWord in dictionary) {
          const americanWord = dictionary[britishWord];
          const regex = new RegExp("\\b" + britishWord + "\\b", "gi");
          text = text.replace(regex, americanWord);
        }
        node.nodeValue = text;
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        node.childNodes.forEach(replaceWords);
      }
    }

    replaceWords(document.body);
    const observer = new MutationObserver(function(mutations){
        mutations.forEach(function(mutation){
            if(mutation.addedNodes){
                mutation.addedNodes.forEach(function(node){
                    replaceWords(node);
                });
            }
        });
    });
    observer.observe(document.body, {childList: true, subtree: true});

  });

//Credit: http://github.com/evanbenjamin27